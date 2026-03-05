"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { setDoc, doc, serverTimestamp, Timestamp, runTransaction } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';
import { Ticket, Sparkles, Flower2, Camera, UploadCloud, X } from 'lucide-react';
import { db } from '@/lib/firebase';
import { useLocationData } from '@/hooks/useLocationData';
import { uploadDelegateImage, validateImageFile } from '@/services/delegateImageService';
import useAuthStore from '@/lib/stores/useAuthStore';
import FreePassPersonalInfo from './FreePassPersonalInfo';
import FreePassLocationInfo from './FreePassLocationInfo';
import FreePassMembersInfo from './FreePassMembersInfo';

const createEmptyMember = () => ({
  name: '',
  phone: '',
  gender: '',
  age: '',
  aadhar: '',
});

const EVENT_DATE_LABEL = '13, 14, 15 June 2026';
const EVENT_DATE_RANGE = ['2026-06-13', '2026-06-14', '2026-06-15'];

const FreePassForm = () => {
  const router = useRouter();
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    aadharno: '',
    country: 'India',
    state: '',
    city: '',
    address: '',
    pincode: '',
    numberOfPersons: '0',
    members: [],
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [memberErrors, setMemberErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { countries, states, cities, loading } = useLocationData(formData);

  useEffect(() => {
    const persons = Math.max(0, parseInt(formData.numberOfPersons, 10) || 0);
    setFormData((prev) => {
      if (prev.members.length === persons) return prev;
      const nextMembers = [...prev.members];
      if (nextMembers.length < persons) {
        while (nextMembers.length < persons) nextMembers.push(createEmptyMember());
      } else {
        nextMembers.length = persons;
      }
      return { ...prev, members: nextMembers };
    });

    setMemberErrors((prev) => {
      const next = [...prev];
      if (next.length < persons) {
        while (next.length < persons) next.push({});
      } else {
        next.length = persons;
      }
      return next;
    });
  }, [formData.numberOfPersons]);

  const primaryAddress = useMemo(
    () =>
      [formData.address, formData.city, formData.state, formData.country, formData.pincode]
        .filter(Boolean)
        .join(', '),
    [formData.address, formData.city, formData.state, formData.country, formData.pincode]
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let nextValue = value;

    if (name === 'mobile') nextValue = value.replace(/\D/g, '').slice(0, 10);
    if (name === 'pincode') nextValue = value.replace(/\D/g, '').slice(0, 6);
    if (name === 'numberOfPersons') {
      const digits = value.replace(/\D/g, '').slice(0, 2);
      const parsed = parseInt(digits || '0', 10);
      nextValue = String(Math.min(20, Math.max(0, parsed)));
    }
    if (name === 'aadharno') nextValue = value.replace(/\D/g, '').slice(0, 12);

    setFormData((prev) => {
      let next = { ...prev, [name]: nextValue };
      if (name === 'country') next = { ...next, state: '', city: '' };
      if (name === 'state') next = { ...next, city: '' };
      return next;
    });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleMemberChange = (index, key, value) => {
    let nextValue = value;
    if (key === 'phone') nextValue = value.replace(/\D/g, '').slice(0, 10);
    if (key === 'age') nextValue = value.replace(/\D/g, '').slice(0, 3);
    if (key === 'aadhar') nextValue = value.replace(/\D/g, '').slice(0, 12);

    setFormData((prev) => {
      const members = [...prev.members];
      members[index] = { ...members[index], [key]: nextValue };
      return { ...prev, members };
    });

    setMemberErrors((prev) => {
      const next = [...prev];
      next[index] = { ...(next[index] || {}), [key]: '' };
      return next;
    });
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    const validation = validateForm(formData, selectedFile);
    if (validation.errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: validation.errors[name] }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = await validateImageFile(file);
    if (!validation.isValid) {
      toast.error(validation.error || 'Invalid image file');
      return;
    }

    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, selfie: '' }));
  };

  const clearFile = () => {
    setSelectedFile(null);
    setImagePreview(null);
    const photoInput = document.getElementById('free-pass-photo');
    if (photoInput) photoInput.value = '';
  };

  const validateForm = (data, file) => {
    const nextErrors = {};
    const nextMemberErrors = data.members.map(() => ({}));

    if (!data.name.trim()) nextErrors.name = 'Name is required';

    if (!data.email.trim()) nextErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(data.email)) nextErrors.email = 'Enter a valid email';

    if (!/^[6-9]\d{9}$/.test(data.mobile)) nextErrors.mobile = 'Enter valid 10-digit mobile number';

    if (!/^\d{12}$/.test(data.aadharno || '')) nextErrors.aadharno = 'Aadhar must be 12 digits';

    if (!data.country) nextErrors.country = 'Country is required';
    if (!data.state?.trim()) nextErrors.state = 'State is required';
    if (!data.city?.trim()) nextErrors.city = 'City is required';
    if (!data.address?.trim() || data.address.trim().length < 10) nextErrors.address = 'Address must be at least 10 characters';
    if (!/^\d{6}$/.test(data.pincode)) nextErrors.pincode = 'Pincode must be 6 digits';

    const persons = parseInt(data.numberOfPersons, 10) || 0;
    if (persons > 20) nextErrors.numberOfPersons = 'Maximum 20 persons allowed per booking';

    if (persons > 0) {
      data.members.forEach((member, index) => {
        if (!member.name.trim()) nextMemberErrors[index].name = 'Name is required';
        if (!/^[6-9]\d{9}$/.test(member.phone)) nextMemberErrors[index].phone = 'Valid 10-digit phone required';
        if (!member.gender) nextMemberErrors[index].gender = 'Gender is required';
        const age = parseInt(member.age, 10);
        if (!age || age < 1 || age > 120) nextMemberErrors[index].age = 'Enter valid age (1-120)';
        if (!/^\d{12}$/.test(member.aadhar)) nextMemberErrors[index].aadhar = 'Aadhar must be 12 digits';
      });
    }

    if (!file) nextErrors.selfie = 'Photo is required';

    return { errors: nextErrors, memberErrors: nextMemberErrors };
  };

  const generateBookingId = async () => {
    const yearShort = String(new Date().getFullYear()).slice(-2);
    const counterRef = doc(db, 'application_counters', `epass_${yearShort}`);

    const seq = await runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(counterRef);
      const current = snapshot.exists() ? Number(snapshot.data()?.seq || 0) : 0;
      const next = current + 1;
      transaction.set(
        counterRef,
        {
          seq: next,
          year: yearShort,
          updatedAt: Timestamp.now(),
        },
        { merge: true }
      );
      return next;
    });

    const padded = String(seq).padStart(3, '0');
    return `orp-epass-${yearShort}-${padded}`;
  };

  const sendConfirmationEmail = async (bookingId) => {
    const emailPayload = {
      name: formData.name,
      email: formData.email,
      pass_no: bookingId,
    };

    const response = await fetch('/api/emails/entry-pass', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailPayload),
    });

    const result = await response.json();
    if (!response.ok || !result?.status) {
      throw new Error(result?.message || 'Email service failed');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      mobile: '',
      aadharno: '',
      country: 'India',
      state: '',
      city: '',
      address: '',
      pincode: '',
      numberOfPersons: '0',
      members: [],
    });
    setErrors({});
    setMemberErrors([]);
    clearFile();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateForm(formData, selectedFile);
    setErrors(validation.errors);
    setMemberErrors(validation.memberErrors);

    const hasMemberErrors = validation.memberErrors.some((item) => Object.keys(item).length > 0);
    if (Object.keys(validation.errors).length > 0 || hasMemberErrors) {
      toast.error('Please fix all required fields');
      return;
    }

    if (!user) {
      toast.error('Please login to continue');
      return;
    }

    setIsSubmitting(true);
    try {
      const bookingId = await generateBookingId();

      setImageUploading(true);
      const imageUploadResult = await uploadDelegateImage(selectedFile, bookingId);
      setImageUploading(false);
      if (!imageUploadResult.success) {
        throw new Error(imageUploadResult.error || 'Failed to upload photo');
      }

      const bookingData = {
        id: bookingId,
        bookingId,
        userId: user.uid,
        type: 'delegate',
        category: 'free_pass',
        status: 'confirmed',
        totalAmount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        payment: {
          paymentId: 'free_pass',
          amount: 0,
          status: 'confirmed',
          orderId: bookingId,
          transactionId: 'FREE_PASS',
        },
        delegateDetails: {
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          aadharno: formData.aadharno,
          country: formData.country,
          state: formData.state,
          city: formData.city,
          address: formData.address,
          pincode: formData.pincode,
          fileInfo: {
            fileName: imageUploadResult.fileName,
            originalName: imageUploadResult.originalName,
            fileSize: imageUploadResult.size,
            fileType: imageUploadResult.type,
            fileUploaded: true,
            imageUrl: imageUploadResult.url,
          },
        },
        eventDetails: {
          participationType: 'Free Pass',
          delegateType: 'freePass',
          duration: '3',
          numberOfPersons: String(formData.members.length),
          eventDates: EVENT_DATE_RANGE,
          members: formData.members,
        },
      };

      await setDoc(doc(db, 'delegateBookings', bookingId), bookingData);

      try {
        await sendConfirmationEmail(bookingId);
      } catch (mailError) {
        toast.error(`Booking saved but email failed: ${mailError.message}`);
      }

      resetForm();
      await Swal.fire({
        icon: 'success',
        title: 'Successfully Submitted',
        text: 'Your Entry Pass registration has been submitted.',
        showConfirmButton: false,
        timer: 1800,
        timerProgressBar: true,
        background: '#f0fdf4',
        color: '#14532d',
        iconColor: '#16a34a',
      });
      router.push('/profile?tab=entryPass');
    } catch (error) {
      toast.error(error.message || 'Unable to complete free pass booking');
    } finally {
      setImageUploading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-emerald-50 to-sky-100 py-8 px-4">
      {/* Decorative Elements */}
      <div className="fixed top-0 left-0 h-64 w-64 rounded-full bg-orange-300/30 blur-3xl -z-10"></div>
      <div className="fixed bottom-0 right-0 h-96 w-96 rounded-full bg-emerald-300/30 blur-3xl -z-10"></div>
      
      <div className="max-w-5xl mx-auto">
        {/* Enhanced Header */}
        <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-rose-500 via-orange-500 to-rose-500 p-8 shadow-xl">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzAgMTBhMjAgMjAgMCAwIDEgMjAgMjAgMjAgMjAgMCAwIDEtNDAgMCAyMCAyMCAwIDAgMSAyMC0yMHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIgZmlsdGVyPSJibHVyKDIpIi8+PC9zdmc+')] opacity-20"></div>
          
          <div className="relative flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <Ticket className="h-8 w-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-white/90 text-sm mb-1">
                <Sparkles className="h-4 w-4" />
                <span>Raja Festival 2026</span>
                <Flower2 className="h-4 w-4" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Entry Pass Registration</h1>
              <p className="mt-1 max-w-2xl text-white/90">
                Book your complimentary pass for all three days • 13, 14, 15 June 2026
              </p>
            </div>
          </div>
          
          <div className="absolute -bottom-6 -right-6 h-32 w-32 rotate-12 opacity-30">
            <Flower2 className="h-full w-full text-white" />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-orange-50/70 to-emerald-50/70 p-6 shadow-xl md:p-8">
            <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4">
              <h2 className="text-2xl font-bold text-slate-900">Entry Pass Registration</h2>
              <div className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                <Sparkles className="h-3.5 w-3.5" />
                13, 14, 15 June 2026
              </div>
            </div>

            <div className="flex flex-col items-start gap-6 md:flex-row">
              <div className="flex-1">
                <p className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Camera className="h-4 w-4" />
                  Please upload a clear photo where your face is clearly visible
                </p>
                
                <input id="free-pass-photo" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                
                {!imagePreview ? (
                  <label
                    htmlFor="free-pass-photo"
                    className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-white px-4 py-8 transition hover:border-emerald-500 hover:bg-emerald-50/40"
                  >
                    <UploadCloud className="h-8 w-8 text-emerald-600" />
                    <span className="text-sm font-semibold text-slate-800">Click to upload photo</span>
                    <span className="text-xs text-slate-600">JPEG, PNG, WebP (max 5MB)</span>
                  </label>
                ) : (
                  <div className="flex items-center gap-4 rounded-xl border border-emerald-300 bg-emerald-50/40 p-3">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-20 w-20 rounded-lg border-2 border-emerald-500 object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800">Photo uploaded successfully</p>
                      <p className="mb-2 text-xs text-slate-600">{selectedFile?.name}</p>
                      <button
                        type="button"
                        onClick={clearFile}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-300 bg-white px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        <X className="h-3 w-3" />
                        Remove
                      </button>
                    </div>
                  </div>
                )}
                
                {errors.selfie && <p className="mt-2 text-xs text-red-600">{errors.selfie}</p>}
                {imageUploading && <p className="mt-2 text-sm text-emerald-700">Uploading photo...</p>}
              </div>
              
              <div className="w-full rounded-xl border border-sky-200 bg-sky-50 p-4 md:w-56">
                <ul className="space-y-1 list-disc pl-4 text-xs font-medium text-sky-800">
                  <li>Clear face visible</li>
                  <li>No sunglasses</li>
                  <li>Recent photo preferred</li>
                  <li>Max 5MB size</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 space-y-6 border-t border-slate-200 pt-6">
              <FreePassPersonalInfo
                formData={formData}
                errors={errors}
                handleInputChange={handleInputChange}
                handleBlur={handleBlur}
              />

              <FreePassLocationInfo
                formData={formData}
                errors={errors}
                handleInputChange={handleInputChange}
                handleBlur={handleBlur}
                countries={countries}
                states={states}
                cities={cities}
              />

              <FreePassMembersInfo
                formData={formData}
                errors={errors}
                memberErrors={memberErrors}
                handleInputChange={handleInputChange}
                handleMemberChange={handleMemberChange}
                handleBlur={handleBlur}
              />

              <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-orange-50 to-rose-50 p-6">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="bg-gradient-to-r from-emerald-700 to-rose-700 bg-clip-text text-2xl font-bold text-transparent">
                      Total: Free
                    </p>
                    <p className="flex items-center gap-1 text-sm font-medium text-slate-700">
                      <Ticket className="h-4 w-4" />
                      {formData.members.length} person(s) for 3 days ({EVENT_DATE_LABEL})
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting || loading.countries}
                    className="group cursor-pointer relative overflow-hidden rounded-xl bg-gradient-to-r from-rose-500 via-rose-400 to-rose-700 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span className="relative  z-10 flex items-center gap-2">
                      {isSubmitting ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          <span>Confirm Free Pass</span>
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-600 via-rose-500 to-rose-800 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FreePassForm;
