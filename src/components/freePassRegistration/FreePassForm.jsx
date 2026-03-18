"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Playfair_Display, Cinzel } from 'next/font/google';
import { useRouter } from 'next/navigation';
import { setDoc, doc, serverTimestamp, Timestamp, runTransaction, collection, query, where, limit, getDocs } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';
import { Ticket, Sparkles, Flower2, Camera, UploadCloud, X, CalendarDays } from 'lucide-react';
import { db } from '@/lib/firebase';
import { useLocationData } from '@/hooks/useLocationData';
import { uploadDelegateImage, validateImageFile } from '@/services/delegateImageService';
import useAuthStore from '@/lib/stores/useAuthStore';
import FreePassPersonalInfo from './FreePassPersonalInfo';
import FreePassLocationInfo from './FreePassLocationInfo';
import FreePassMembersInfo from './FreePassMembersInfo';
import Link from 'next/link';

const createEmptyMember = () => ({ name: '', gender: '', age: '' });

const EVENT_DATE_LABEL = '13, 14, 15 June 2026';
const EVENT_DATE_RANGE = ['2026-06-13', '2026-06-14', '2026-06-15'];
const ENTRY_PASS_DONATION_PER_PERSON = 10;

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

const FreePassForm = () => {
  const router = useRouter();
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    name: '', email: '', mobile: '', aadharno: '',
    country: 'India', state: '', city: '', address: '',
    pincode: '', numberOfPersons: '1', members: [],
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [memberErrors, setMemberErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { countries, states, cities, loading } = useLocationData(formData);
  const totalPersons = Math.min(20, Math.max(1, parseInt(formData.numberOfPersons, 10) || 1));
  const totalAmount = totalPersons * ENTRY_PASS_DONATION_PER_PERSON;

  useEffect(() => {
    const persons = Math.min(20, Math.max(1, parseInt(formData.numberOfPersons, 10) || 1));
    const additionalMembers = Math.max(0, persons - 1);
    setFormData((prev) => {
      if (prev.members.length === additionalMembers) return prev;
      const nextMembers = [...prev.members];
      if (nextMembers.length < additionalMembers) {
        while (nextMembers.length < additionalMembers) nextMembers.push(createEmptyMember());
      } else { nextMembers.length = additionalMembers; }
      return { ...prev, members: nextMembers };
    });
    setMemberErrors((prev) => {
      const next = [...prev];
      if (next.length < additionalMembers) {
        while (next.length < additionalMembers) next.push({});
      } else { next.length = additionalMembers; }
      return next;
    });
  }, [formData.numberOfPersons]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let nextValue = value;
    if (name === 'mobile') nextValue = value.replace(/\D/g, '').slice(0, 10);
    if (name === 'pincode') nextValue = value.replace(/\D/g, '').slice(0, 6);
    if (name === 'numberOfPersons') {
      const digits = value.replace(/\D/g, '').slice(0, 2);
      const parsed = parseInt(digits || '1', 10);
      nextValue = String(Math.min(20, Math.max(1, parsed)));
    }
    if (name === 'aadharno') nextValue = value.replace(/\D/g, '').slice(0, 12);
    setFormData((prev) => {
      let next = { ...prev, [name]: nextValue };
      if (name === 'country') next = { ...next, state: '', city: '' };
      if (name === 'state') next = { ...next, city: '' };
      return next;
    });
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleMemberChange = (index, key, value) => {
    let nextValue = value;
    if (key === 'age') nextValue = value.replace(/\D/g, '').slice(0, 3);
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

  const setPersonCount = (count) => {
    setFormData((prev) => ({ ...prev, numberOfPersons: String(Math.min(20, Math.max(1, count))) }));
    if (errors.numberOfPersons) setErrors((prev) => ({ ...prev, numberOfPersons: '' }));
  };

  const incrementPersons = () => setPersonCount(totalPersons + 1);
  const decrementPersons = () => setPersonCount(totalPersons - 1);

  const handleBlur = (e) => {
    const { name } = e.target;
    const validation = validateForm(formData);
    if (validation.errors[name]) setErrors((prev) => ({ ...prev, [name]: validation.errors[name] }));
    else setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validation = await validateImageFile(file);
    if (!validation.isValid) { toast.error(validation.error || 'Invalid image file'); return; }
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

  const validateForm = (data) => {
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
    if (persons < 1) nextErrors.numberOfPersons = 'Minimum 1 person is required';
    if (persons > 20) nextErrors.numberOfPersons = 'Maximum 20 persons allowed per booking';
    if (persons > 1) {
      data.members.forEach((member, index) => {
        if (!member.name.trim()) nextMemberErrors[index].name = 'Name is required';
        if (!member.gender) nextMemberErrors[index].gender = 'Gender is required';
        const age = parseInt(member.age, 10);
        if (!age || age < 1 || age > 120) nextMemberErrors[index].age = 'Enter valid age (1-120)';
      });
    }
    return { errors: nextErrors, memberErrors: nextMemberErrors };
  };

  const generateBookingId = async () => {
    const yearShort = String(new Date().getFullYear()).slice(-2);
    const counterRef = doc(db, 'application_counters', `epass_${yearShort}`);
    const seq = await runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(counterRef);
      const current = snapshot.exists() ? Number(snapshot.data()?.seq || 0) : 0;
      const next = current + 1;
      transaction.set(counterRef, { seq: next, year: yearShort, updatedAt: Timestamp.now() }, { merge: true });
      return next;
    });
    return `orp-epass-${yearShort}-${String(seq).padStart(3, '0')}`;
  };

  const sendConfirmationEmail = async (bookingId) => {
    const response = await fetch('/api/emails/entry-pass', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: formData.name, email: formData.email, pass_no: bookingId }),
    });
    const result = await response.json();
    if (!response.ok || !result?.status) throw new Error(result?.message || 'Email service failed');
  };

  const submitToCCAvenue = (encRequest, accessCode) => {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction';
    form.target = '_self';
    form.style.display = 'none';
    const encInput = document.createElement('input');
    encInput.type = 'hidden'; encInput.name = 'encRequest'; encInput.value = encRequest;
    form.appendChild(encInput);
    const accessInput = document.createElement('input');
    accessInput.type = 'hidden'; accessInput.name = 'access_code'; accessInput.value = accessCode;
    form.appendChild(accessInput);
    document.body.appendChild(form);
    form.submit();
    setTimeout(() => { if (document.body.contains(form)) document.body.removeChild(form); }, 1000);
  };

  const createFreePassBooking = async ({ bookingId, imageUploadResult, paymentData, status }) => {
    const bookingData = {
      id: bookingId, bookingId, userId: user.uid, type: 'delegate', category: 'free_pass', status,
      totalAmount, createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
      expiryTime: status === 'pending_payment' ? new Date(Date.now() + 5 * 60 * 1000) : null,
      payment: { paymentId: paymentData.paymentId || `entry_pass_${Date.now()}`, amount: totalAmount, status, orderId: bookingId, transactionId: paymentData.transactionId || paymentData.paymentId || bookingId },
      delegateDetails: {
        name: formData.name, email: formData.email, mobile: formData.mobile, aadharno: formData.aadharno,
        country: formData.country, state: formData.state, city: formData.city, address: formData.address, pincode: formData.pincode,
        fileInfo: imageUploadResult ? { fileName: imageUploadResult.fileName, originalName: imageUploadResult.originalName, fileSize: imageUploadResult.size, fileType: imageUploadResult.type, fileUploaded: true, imageUrl: imageUploadResult.url } : { fileUploaded: false },
      },
      eventDetails: { participationType: 'Entry Pass', delegateType: 'freePass', duration: '3', numberOfPersons: String(totalPersons), eventDates: EVENT_DATE_RANGE, members: formData.members },
    };
    await setDoc(doc(db, 'delegateBookings', bookingId), bookingData);
  };

  const hasExistingFreePass = async (userId) => {
    if (!userId) return false;
    const existingPassSnap = await getDocs(query(collection(db, 'delegateBookings'), where('userId', '==', userId), where('category', '==', 'free_pass')));
    if (existingPassSnap.empty) return false;
    return existingPassSnap.docs.some((docSnap) => ['confirmed', 'completed', 'paid', 'success'].includes(String(docSnap.data()?.status || '').toLowerCase()));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateForm(formData);
    setErrors(validation.errors);
    setMemberErrors(validation.memberErrors);
    const hasMemberErrors = validation.memberErrors.some((item) => Object.keys(item).length > 0);
    if (Object.keys(validation.errors).length > 0 || hasMemberErrors) { toast.error('Please fix all required fields'); return; }
    if (!user) { toast.error('Please login to continue'); return; }
    setIsSubmitting(true);
    try {
      const alreadyHasPass = await hasExistingFreePass(user.uid);
      if (alreadyHasPass) {
        await Swal.fire({
          html: `<div style="display:flex;flex-direction:column;align-items:center;gap:10px;padding:8px 4px;"><div style="width:58px;height:58px;border-radius:9999px;background:linear-gradient(135deg,#f59e0b,#f97316);display:flex;align-items:center;justify-content:center;color:white;font-size:28px;font-weight:700;box-shadow:0 8px 18px rgba(249,115,22,.35);">!</div><h2 style="margin:0;font-size:1.2rem;color:#1f2937;font-weight:700;">Entry Pass Already Booked</h2><p style="margin:0;font-size:0.95rem;color:#4b5563;text-align:center;line-height:1.45;">You already have an Entry Pass.<br/>Redirecting to your profile.</p></div>`,
          confirmButtonText: 'Go to Profile', confirmButtonColor: '#ea580c', background: '#fff7ed', color: '#7c2d12',
          customClass: { popup: 'rounded-2xl shadow-2xl', confirmButton: 'rounded-lg px-5 py-2 font-semibold' },
        });
        router.push('/profile?tab=entryPass');
        return;
      }
      let imageUploadResult = null;
      const bookingId = await generateBookingId();
      if (selectedFile) {
        setImageUploading(true);
        try {
          imageUploadResult = await uploadDelegateImage(selectedFile, bookingId);
          if (!imageUploadResult.success) throw new Error(imageUploadResult.error || 'Failed to upload photo');
        } finally { setImageUploading(false); }
      }
      await createFreePassBooking({ bookingId, imageUploadResult, paymentData: { paymentId: `pending_${Date.now()}`, transactionId: `pending_${Date.now()}` }, status: 'pending_payment' });
      const paymentRequest = { order_id: bookingId, purpose: 'delegate_booking', amount: totalAmount.toString(), name: formData.name, email: formData.email, phone: formData.mobile, address: `${formData.address}, ${formData.city}, ${formData.state}, ${formData.country} - ${formData.pincode}` };
      const response = await fetch('/api/payment/ccavenue-request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(paymentRequest) });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (!data.status || !data.encRequest || !data.access_code) throw new Error(data.errors?.join(', ') || 'Unable to initiate payment');
      submitToCCAvenue(data.encRequest, data.access_code);
    } catch (error) {
      toast.error(error.message || 'Unable to complete free pass booking');
    } finally {
      setImageUploading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50/40 to-emerald-50 py-6 px-3 sm:px-4 sm:py-8">
      {/* Subtle decorative blobs â€” hidden on mobile to avoid layout bleed */}
      <div className="fixed top-0 left-0 h-48 w-48 rounded-full bg-orange-200/25 blur-3xl -z-10 hidden sm:block" />
      <div className="fixed bottom-0 right-0 h-72 w-72 rounded-full bg-emerald-200/25 blur-3xl -z-10 hidden sm:block" />

      <div className="mx-auto max-w-5xl">

        {/*  HERO HEADER */}
        <div className="relative mb-5 overflow-hidden rounded-2xl sm:mb-6 sm:rounded-3xl bg-gradient-to-br from-rose-600 via-orange-500 to-rose-500 shadow-xl">
          {/* Floral watermark â€” top right */}
          <Flower2 className="absolute -top-3 -right-3 h-20 w-20 text-white/10 rotate-12 sm:-top-4 sm:-right-4 sm:h-44 sm:w-44" />
          <Flower2 className="absolute -bottom-4 -left-4 h-16 w-16 text-white/10 -rotate-12 sm:-bottom-6 sm:-left-6 sm:h-32 sm:w-32" />

          <div className="relative px-4 py-5 sm:px-8 sm:py-10">
            {/* Festival badge */}
            <div className="mb-3 flex justify-center sm:mb-4 sm:justify-start">
              <span className={`${playfair.className} inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm sm:gap-1.5 sm:px-3 sm:text-xs`}>
                <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                Raja Festival 2026
                <Flower2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              </span>
            </div>

            {/* Title block â€” centered mobile, left-aligned desktop */}
            <div className="text-center sm:text-left">
              <h1 className={`${cinzel.className} text-xl font-semibold leading-tight text-white sm:text-3xl md:text-4xl`}>
                Entry Pass Registration
              </h1>
              <p className={`${playfair.className} mt-1.5 text-xs text-white/85 sm:mt-2 sm:text-base`}>
                Book your complimentary pass for all three days
              </p>
            </div>

            {/* Date pill â€” below title on mobile, inline on desktop */}
            <div className="mt-3 flex justify-center sm:mt-4 sm:justify-start">
              <span className={`${playfair.className} inline-flex items-center gap-1.5 rounded-full bg-white/25 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm sm:gap-2 sm:px-4 sm:text-sm`}>
                <CalendarDays className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                13, 14 &amp; 15 June 2026
              </span>
            </div>
          </div>
        </div>

        {/*  FORM CARD */}
        <form onSubmit={handleSubmit}>
          <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-lg">

            {/* Card header */}
            <div className="flex flex-col items-center gap-2 border-b border-slate-100 px-4 py-4 text-center sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-5 sm:text-left">
              <h2 className={`${cinzel.className} text-lg font-semibold text-slate-900 sm:text-xl`}>Registration Details</h2>
              <span className={`${playfair.className} inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700`}>
                <Sparkles className="h-3 w-3" />
                Free Entry · 3 Days
              </span>
            </div>

            <div className="space-y-5 p-4 sm:p-8">

              {/* PHOTO UPLOAD */}
              <div>
                <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Camera className="h-4 w-4 text-emerald-600" />
                  Upload Photo
                  <span className="text-xs font-normal text-slate-400">(optional)</span>
                </p>

                <input id="free-pass-photo" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

                {!imagePreview ? (
                  <label
                    htmlFor="free-pass-photo"
                    className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/80 px-4 py-8 text-center transition hover:border-emerald-400 hover:bg-emerald-50/40"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                      <UploadCloud className="h-5 w-5 text-emerald-600" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">Tap to upload photo</span>
                    <span className="text-xs text-slate-400">JPEG, PNG, WebP · max 5 MB</span>
                  </label>
                ) : (
                  <div className="flex items-center gap-4 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3">
                    <img src={imagePreview} alt="Preview" className="h-16 w-16 rounded-lg border-2 border-emerald-400 object-cover sm:h-20 sm:w-20" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800">Photo ready ✓</p>
                      <p className="truncate text-xs text-slate-500">{selectedFile?.name}</p>
                      <button type="button" onClick={clearFile} className="mt-2 inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50">
                        <X className="h-3 w-3" /> Remove
                      </button>
                    </div>
                  </div>
                )}
                {imageUploading && <p className="mt-2 text-sm text-emerald-700">Uploading...</p>}
              </div>

              {/*  SECTION COMPONENTS  */}
              <FreePassPersonalInfo formData={formData} errors={errors} handleInputChange={handleInputChange} handleBlur={handleBlur} />
              <FreePassLocationInfo formData={formData} errors={errors} handleInputChange={handleInputChange} handleBlur={handleBlur} countries={countries} states={states} cities={cities} />
              <FreePassMembersInfo formData={formData} errors={errors} memberErrors={memberErrors} totalPersons={totalPersons} onIncrementPersons={incrementPersons} onDecrementPersons={decrementPersons} handleMemberChange={handleMemberChange} />

              {/*  TERMS  */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:rounded-2xl sm:p-5">
                <h3 className="mb-3 text-sm font-bold text-slate-800 sm:text-base">Terms &amp; Conditions</h3>
                <ul className="space-y-1.5 text-xs text-slate-600 sm:text-sm">
                  {[
                    'Firearms are strictly not permitted inside the venue.',
                    'The complimentary pass must be produced for entry to any event.',
                    'Organizers reserve the right to modify artists, programs, prices, or venues without prior notice.',
                    'Admission is subject to venue terms. Late arrivals may result in non-admittance until a suitable break.',
                    'A search of person and/or possessions may be required at entry.',
                    'Entry may be refused if passes are damaged, defaced, or not issued by organizers.',
                  ].map((term, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                      <span>{term}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/*  DONATION + PAYMENT  */}
              <div className="rounded-lg border border-rose-200 bg-gradient-to-br from-rose-50 via-orange-50/60 to-emerald-50/60 p-2 md:p-4 sm:rounded-xl sm:p-4">
               {/* Donation notice */}
<div className="mb-5 rounded-xl border border-rose-100 bg-white/85 p-3 sm:p-4">
  <div className="flex items-start gap-3">
    <input
      type="checkbox"
      checked
      readOnly
      tabIndex={-1}
      className="pointer-events-none mt-1 h-4 w-4 shrink-0 accent-blue-600"
    />

    <div className="flex min-w-0 flex-1 flex-col gap-3">

      {/* Text content — always full width */}
<div className="min-w-0 w-full">
  <p className="text-sm leading-6 text-slate-700">
    <span className="font-semibold text-rose-700">
      ₹{ENTRY_PASS_DONATION_PER_PERSON} per person
    </span>
    {' '}— We all hold the power to{' '}
    <em className="not-italic font-semibold text-rose-600">give 🤝</em>
    {' '}even a small act of kindness can bring{' '}
    <em className="not-italic font-semibold text-amber-700">food to the hungry 🍱</em>
    {' '}and{' '}
    <em className="not-italic font-semibold text-rose-600">education</em>
    {' '}to those who need it{' '}
    <em className="not-italic font-semibold text-amber-700">most ✨</em>
  </p>
  <div className="mt-2 flex flex-wrap items-center gap-2">
    <span className="text-sm font-medium text-slate-600">
      Want to contribute more?
    </span>
    
    <Link
      href="/donate"
      className="inline-flex items-center rounded-full border border-rose-200 bg-white px-3 py-1 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
    >
      Donate Here →
    </Link>
  </div>
</div>

      {/* Image — full width on mobile, fixed size beside text on sm+ */}
      <div className="relative h-28 w-full overflow-hidden rounded-xl border border-rose-100 sm:hidden">
        <Image
          src="/donation5.jpg"
          alt="Donation support"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

    </div>

    {/* Image — hidden on mobile, shown on sm+ beside text */}
    <div className="relative hidden h-28 w-36 shrink-0 overflow-hidden rounded-xl border border-rose-100 sm:block">
      <Image
        src="/donation2.jpg"
        alt="Donation support"
        fill
        sizes="144px"
        className="object-cover"
      />
    </div>

  </div>
</div>

                {/* Total + CTA */}
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-center sm:text-left">
                    <p className="bg-gradient-to-r from-emerald-700 to-rose-600 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
                      ₹{totalAmount.toLocaleString('en-IN')}
                    </p>
                    <p className="mt-0.5 flex items-center justify-center gap-1 text-xs text-slate-600 sm:justify-start sm:text-sm">
                      <Ticket className="h-3.5 w-3.5" />
                      {totalPersons} person(s) · 3 days · {EVENT_DATE_LABEL}
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || loading.countries}
                    className="group relative w-full cursor-pointer overflow-hidden rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 px-8 py-3.5 font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isSubmitting ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          Processing
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Proceed to Payment
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-rose-700 opacity-0 transition-opacity group-hover:opacity-100" />
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

