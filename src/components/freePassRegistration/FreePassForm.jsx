"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { Ticket } from 'lucide-react';
import { db } from '@/lib/firebase';
import { useLocationData } from '@/hooks/useLocationData';
import { uploadDelegateImage, validateImageFile } from '@/services/delegateImageService';
import useAuthStore from '@/lib/stores/useAuthStore';
import FreePassPersonalInfo from './FreePassPersonalInfo';
import FreePassLocationInfo from './FreePassLocationInfo';
import FreePassMembersInfo from './FreePassMembersInfo';
import FreePassAdditionalDetails from './FreePassAdditionalDetails';
import FreePassSuccessModal from './FreePassSuccessModal';

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
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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

  const generateBookingId = () => `FREEPASS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const sendConfirmationEmail = async (bookingId, members) => {
    const emailPayload = {
      name: formData.name,
      email: formData.email,
      order_id: bookingId,
      event_date: EVENT_DATE_LABEL,
      booking_type: 'Delegate Free Pass Registration',
      amount: '0',
      mobile: formData.mobile,
      address: primaryAddress,
      delegate_type: 'normal',
      duration: '3',
      number_of_person: String(members.length),
      details: `Free pass confirmed for ${members.length} person(s). Event dates: ${EVENT_DATE_LABEL}.`,
    };

    const response = await fetch('/api/emails/delegate', {
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
      const bookingId = generateBookingId();

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
        await sendConfirmationEmail(bookingId, formData.members);
      } catch (mailError) {
        toast.error(`Booking saved but email failed: ${mailError.message}`);
      }

      setShowSuccessModal(true);
      resetForm();
    } catch (error) {
      toast.error(error.message || 'Unable to complete free pass booking');
    } finally {
      setImageUploading(false);
      setIsSubmitting(false);
    }
  };

  const goHome = () => {
    setShowSuccessModal(false);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_10%_20%,#cffafe_0%,#f8fafc_45%,#dbeafe_100%)] px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 rounded-3xl border border-cyan-200 bg-gradient-to-r from-cyan-700 via-blue-700 to-indigo-700 p-6 text-white shadow-xl">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs uppercase tracking-wider">
            <Ticket className="h-3 w-3" />
            Raja Festival Free Pass
          </p>
          <h1 className="mt-3 text-2xl font-black md:text-3xl">Book Your Free Pass</h1>
          <p className="mt-2 max-w-3xl text-sm text-cyan-100 md:text-base">
            Fill details once and receive confirmation for all three event days: {EVENT_DATE_LABEL}.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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

          <FreePassAdditionalDetails
            errors={errors}
            selectedFile={selectedFile}
            imagePreview={imagePreview}
            imageUploading={imageUploading}
            handleFileChange={handleFileChange}
            clearFile={clearFile}
          />

          <div className="rounded-2xl border border-cyan-100 bg-white p-5 shadow-sm">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-lg font-bold text-slate-900">Total Amount: Free</p>
                <p className="text-sm text-slate-600">
                  {formData.members.length} person(s) for 3 days ({EVENT_DATE_LABEL})
                </p>
              </div>
              <button
                type="submit"
                disabled={isSubmitting || loading.countries}
                className="w-full rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-3 font-semibold text-white transition hover:from-cyan-700 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {isSubmitting ? 'Submitting...' : 'Confirm Free Pass'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <FreePassSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onGoHome={goHome}
      />
    </div>
  );
};

export default FreePassForm;
