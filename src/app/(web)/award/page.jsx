"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { 
  Trophy, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Cake, 
  Camera,
  Sparkles,
  Flower2,
  Medal,
  ChevronDown,
  Hash,
  BookOpen,
  X
} from "lucide-react";
import { createAwardApplication } from "@/services/awardService";
import useAuthStore from "@/lib/stores/useAuthStore";
import { showEntryPassAlert } from "@/utils/showEntryPassAlert";

const awardFieldOptions = [
  { label: "Utkal Seva Samman", icon: "🏛️" },
  { label: "Odisha Pratibha Samman", icon: "🌟" },
  { label: "Odisha Gaurav Award", icon: "🏅" },
  { label: "Odisha Ratna Award", icon: "👑" },
];

const awardDetailsByLanguage = {
  odia: [
    {
      title: "୧. *ଉତ୍କଳ ସେବା ସମ୍ମାନ*",
      description: "ସାମୁଦାୟିକ ବିକାଶ ସମିତି ଦ୍ୱାରା ଓଡ଼ିଶା ରଜ ପର୍ବରେ ପ୍ରଦାନ କରାଯିବ। ଉତ୍କଳ ସେବା ସମ୍ମାନ ସେହି ସବୁ ବ୍ୟକ୍ତିଙ୍କୁ ସ୍ୱୀକୃତି ଜଣାଯିବ, ଯେଉଁମାନେ ନିଜର ନିଷ୍ଠା, ଭକ୍ତି ଓ ନିରହଙ୍କମକ ସହାୟତା ଦ୍ୱାରା ଦିଲ୍ଲୀ ଏନସିଆରରେ ଜଗନ୍ନାଥ ମନ୍ଦିରର ନିର୍ମାଣରେ ମୁଖ୍ୟଭାବେ ଅବଦାନ ରଖିଛନ୍ତି। ଏହି ସମ୍ମାନ ଏହାକୁ ସମ୍ମାନିତ କରିବାପାଇଁ ଯେଉଁମାନେ ମନ୍ଦିର ନିର୍ମାଣ ସମୟରେ ଅଟୁଟ ଦୃଢ଼ତା ପ୍ରଦର୍ଶନ କରିଛନ୍ତି ଏବଂ ଆଧ୍ୟାତ୍ମିକ ଓ ସାମୁଦାୟିକ କାର୍ଯ୍ୟକଳାପକୁ ପୋଷଣ କରି, ଜଗନ୍ନାଥ ସଂସ୍କୃତିକୁ ଓଡ଼ିଶା ସୀମା ପାର କରି ପ୍ରସାର କରୁଛନ୍ତି।",
    },
    {
      title: "୨. *ଓଡ଼ିଶା ପ୍ରତିଭା ସମ୍ମାନ*",
      description: "ସାମୁଦାୟିକ ବିକାଶ ସମିତି ଦ୍ୱାରା ଓଡ଼ିଶା ରଜ ପର୍ବରେ ପ୍ରଦାନ କରାଯିବ, ଓଡ଼ିଶା ପ୍ରତିଭା ସମ୍ମାନ ସେହି ଓଡ଼ିଆ ପ୍ରତିଭାଶାଳୀ ବ୍ୟକ୍ତିମାନଙ୍କୁ ସମ୍ମାନ ଦିଆଯିବ ଯେଉଁମାନେ କେନ୍ଦ୍ର ସରକାର କିମ୍ବା ବେସରକାରୀ କ୍ଷେତ୍ରରେ ନିଷ୍ଠା ଓ ସତ୍ୟତା ସହିତ ଜାତୀୟ ସେବା କରିଛନ୍ତି। ଏହି ସମ୍ମାନ ସେମାନଙ୍କର ଉତ୍କୃଷ୍ଟ ସାର୍ବଜନୀନ ସେବା, ସାମାଜିକ ଉନ୍ନତି ଓ ଲୋକକଳ୍ୟାଣ ପ୍ରତି ଦୀର୍ଘକାଳୀନ ପ୍ରତିବଦ୍ଧତାକୁ ସ୍ୱୀକୃତି ଦେଇଅଛି ଯାହା ଓଡ଼ିଆ ସମୁଦାୟକୁ ଗର୍ବ ଆଣିଦେଇଛି।",
    },
    {
      title: "୩. *ଓଡ଼ିଶା ଗୌରବ ସମ୍ମାନ*",
      description: "ସାମୁଦାୟିକ ବିକାଶ ସମିତି ଦ୍ୱାରା ଓଡ଼ିଶା ରଜ ପର୍ବରେ ପ୍ରଦାନ କରାଯିବ, ଓଡ଼ିଶା ଗୌରବ ସମ୍ମାନ ଦିଲ୍ଲୀ ଏନସିଆରରେ ଥିବା ସେହି ଓଡ଼ିଆ ସଂସ୍ଥାମାନଙ୍କୁ ସ୍ୱୀକାର କରାଯିବ ଯେଉଁମାନେ ଓଡ଼ିଆ ସମୁଦାୟକୁ ସମର୍ଥନ ଓ ଉନ୍ନତି କରିବାରେ ଅପୂର୍ବ ଅବଦାନ ରଖିଛନ୍ତି। ଏହି ସମ୍ମାନ ସାମୁଦାୟିକ ସେବା, ସାଂସ୍କୃତିକ କାର୍ଯ୍ୟକ୍ରମ ଓ ସମୁଦାୟ କଲ୍ୟାଣରେ ଦୀର୍ଘକାଳୀନ ଉତ୍କୃଷ୍ଟତାକୁ ପ୍ରଶଂସା କରାଯିବ।",
    },
    {
      title: "୪. *ଓଡ଼ିଶା ରତ୍ନ ସମ୍ମାନ*",
      description: "ସାମୁଦାୟିକ ବିକାଶ ସମିତି ଦ୍ୱାରା ଓଡ଼ିଶା ରଜ ପର୍ବରେ ପ୍ରଦାନ କରାଯିବ, ଓଡ଼ିଶା ରତ୍ନ ସମ୍ମାନ ସେହି ବ୍ୟକ୍ତିମାନେକୁ ଦିଆଯିବ ଯେଉଁମାନେ ଓଡ଼ିଶାର ସଂସ୍କୃତି, ଐତିହ୍ୟ ଓ ପବିତ୍ର ଜଗନ୍ନାଥ ସଂସ୍କୃତିର ପ୍ରଚାର-ପ୍ରସାର କରିବାରେ ଓଡ଼ିଶା ଏବଂ ଦିଲ୍ଲୀ ଏନସିଆରରେ ଅପୂର୍ବ ପ୍ରୟାସ କରିଛନ୍ତି। ଏହି ସମ୍ମାନ ସେମାନଙ୍କର ସେଇ ଉତ୍ସାହ, ନିଷ୍ଠା ଓ ସଂସ୍କୃତିକ ପ୍ରତି ନିସ୍ଵାର୍ଥ ଯୋଗଦାନକୁ ଉଦ୍‌ଘାଟିତ କରିବ।",
    },
  ],
  english: [
    {
      title: "1. *Utkal Seva Samman*",
      description: "Presented by Samudayik Vikas Samiti on the occasion of Odisha Raja Parba, the Utkal Seva Samman recognizes individuals whose dedication, devotion, and selfless support were instrumental in establishing the Jagannath Temple in Delhi NCR. This award honors those who stood with unwavering commitment during the temple's founding and who continue to nurture spiritual and community activities, spreading Jagannath Sanskriti beyond Odisha.",
    },
    {
      title: "2. *Odisha Pratibha Samman*",
      description: "Presented by Samudayik Vikas Samiti on Odisha Raja Parba, the Odisha Pratibha Samman honors distinguished Odia individuals who have served the nation with integrity and dedication in Central government or private service. The award recognizes their outstanding public service and sustained commitment to social welfare and development, bringing pride to the Odia community.",
    },
    {
      title: "3. *Odisha Gaurav Award*",
      description: "Presented by Samudayik Vikas Samiti on Odisha Raja Parba, the Odisha Gaurav Award recognizes Odia organizations in the Delhi NCR that have made remarkable contributions to supporting and uplifting the Odia community. This award celebrates sustained excellence in social service, cultural initiatives, and community welfare that strengthen the Odia diaspora.",
    },
    {
      title: "4. *Odisha Ratna Award*",
      description: "Presented by Samudayik Vikas Samiti on Odisha Raja Parba, the Odisha Ratna Award honors individuals who have made exceptional contributions to promoting Odisha's culture, heritage, and the sacred Jagannath Sanskriti in Odisha, Delhi NCR. The award celebrates their dedication to preserving and propagating the spiritual and cultural identity of Odisha beyond its borders.",
    },
  ],
  hindi: [
    {
      title: "1. *उत्कल सेवा सम्मान*",
      description: "सामुदायिक विकास समिति द्वारा ओडिशा रज पर्व के अवसर पर प्रस्तुत, उत्कल सेवा सम्मान उन व्यक्तियों को सम्मानित करता है जिनके समर्पण, भक्ति और निःस्वार्थ सहयोग ने दिल्ली एनसीआर में जगन्नाथ मंदिर की स्थापना में महत्वपूर्ण भूमिका निभाई। यह सम्मान उन लोगों को दिया जायेगा जिन्होंने मंदिर की स्थापना के दौरान अटूट प्रतिबद्धता दिखाई और जो आज भी आध्यात्मिक एवं सामुदायिक गतिविधियों को संवारते हुए जगन्नाथ संस्कृति को ओडिशा से परे फैलाने का कार्य कर रहे हैं।",
    },
    {
      title: "2. *ओडिशा प्रतिभा सम्मान*",
      description: "सामुदायिक विकास समिति द्वारा ओडिशा रज पर्व पर प्रस्तुत, ओडिशा प्रतिभा सम्मान उन प्रतिष्ठित ओडिया व्यक्तियों को दिया जाता है जिन्होंने केंद्र सरकार या निजी क्षेत्र में ईमानदारी और समर्पण के साथ देश सेवा की है। यह पुरस्कार उनके उत्कृष्ट सार्वजनिक सेवा और सामाजिक कल्याण व विकास के प्रति दीर्घकालिक प्रतिबद्धता को पहचान देता है, जिससे ओडिशा समुदाय को गौरव होता है।",
    },
    {
      title: "3. *ओडिशा गौरव पुरस्कार*",
      description: "सामुदायिक विकास समिति द्वारा ओडिशा रज पर्व पर प्रस्तुत, ओडिशा गौरव पुरस्कार दिल्ली एनसीआर में स्थित उन ओडिया संस्थाओं को सम्मानित करता है जिन्होंने ओडिशा समुदाय के समर्थन और उत्थान में उल्लेखनीय योगदान दिया है। यह पुरस्कार सामाजिक सेवा, सांस्कृतिक पहलों और सामुदायिक कल्याण में उनकी निरंतर उत्कृष्टता को सम्मानित करता है, जिससे ओडिशा प्रवासी समाज मजबूत होता है।",
    },
    {
      title: "4. *ओडिशा रत्न सम्मान*",
      description: "सामुदायिक विकास समिति द्वारा ओडिशा रज पर्व पर प्रस्तुत, ओडिशा रत्न सम्मान उन व्यक्तियों को दिया जाता है जिन्होंने ओडिशा की संस्कृति, विरासत और पवित्र जगन्नाथ संस्कृति को ओडिशा तथा दिल्ली एनसीआर में प्रसार एवं संवर्धन करने में असाधारण योगदान दिया है। यह सम्मान उनके समर्पण और निःस्वार्थ योगदान के माध्यम से ओडिशा की आध्यात्मिक एवं सांस्कृतिक पहचान के संरक्षण व प्रचार को सराहता है।",
    },
  ],
};

const educationOptions = [
  "10th Pass",
  "12th Pass",
  "Graduate (Degree)",
  "Post Graduate (Masters)",
  "PhD",
  "Diploma",
  "Others"
];

const initialForm = {
  awardField: "",
  name: "",
  phone: "",
  email: "",
  address: "",
  pin: "",
  educationQualification: "",
  age: "",
  gender: "",
  aboutSelf: "",
};

const getWordCount = (text) => {
  const words = (text || "").trim().split(/\s+/).filter(Boolean);
  return words.length;
};

const truncateToWordLimit = (text, limit) => {
  const words = (text || "").trim().split(/\s+/).filter(Boolean);
  if (words.length <= limit) return text;
  return words.slice(0, limit).join(" ");
};

export default function AwardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [form, setForm] = useState(initialForm);
  const [candidatePhoto, setCandidatePhoto] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showAwardDetails, setShowAwardDetails] = useState(false);
  const [awardDetailLang, setAwardDetailLang] = useState("odia");
  const primaryFocusClass = "focus:border-amber-400 focus:ring-1 focus:ring-amber-100";

  const aboutWordCount = useMemo(() => getWordCount(form.aboutSelf), [form.aboutSelf]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAboutChange = (value) => {
    const normalized = value.replace(/\s+/g, " ");
    const limited = truncateToWordLimit(normalized, 100);
    updateField("aboutSelf", limited);
  };

  const handlePhotoChange = (file) => {
    if (!file) {
      setCandidatePhoto(null);
      setPhotoPreview("");
      setPhotoError("Candidate photo is required.");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: "warning",
        title: "File Too Large",
        text: "Please upload an image smaller than 5MB.",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    setCandidatePhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
    setPhotoError("");
  };

  const removePhoto = () => {
    setCandidatePhoto(null);
    setPhotoPreview("");
    setPhotoError("Candidate photo is required.");
  };

  const handleProfileFileChange = (file) => {
    if (!file) {
      setProfileFile(null);
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes((file.type || "").toLowerCase())) {
      Swal.fire({
        icon: "warning",
        title: "Unsupported File",
        text: "Upload PDF, DOC, DOCX, JPG, PNG or WEBP only.",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      Swal.fire({
        icon: "warning",
        title: "File Too Large",
        text: "Profile file must be under 10MB.",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    setProfileFile(file);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      awardField: (form.awardField || "").trim(),
      name: (form.name || "").trim(),
      phone: (form.phone || "").trim(),
      email: (form.email || "").trim(),
      address: (form.address || "").trim(),
      pin: (form.pin || "").trim(),
      educationQualification: (form.educationQualification || "").trim(),
      age: Number(form.age || 0),
      gender: (form.gender || "").trim(),
      aboutSelf: (form.aboutSelf || "").trim(),
      userId: user?.uid || null,
    };

    const hasAllRequired =
      payload.awardField &&
      payload.name &&
      payload.phone &&
      payload.email &&
      payload.address &&
      payload.pin &&
      payload.educationQualification &&
      payload.age &&
      payload.gender &&
      payload.aboutSelf &&
      candidatePhoto;

    if (!hasAllRequired) {
      if (!candidatePhoto) {
        setPhotoError("Candidate photo is required.");
      }
      await Swal.fire({
        icon: "warning",
        title: "Missing Details",
        text: "Please complete all required fields and upload photo.",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    if (getWordCount(payload.aboutSelf) > 100) {
      await Swal.fire({
        icon: "warning",
        title: "Word Limit Exceeded",
        text: "Describe about yourself must be maximum 100 words.",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    try {
      setSubmitting(true);

      const result = await createAwardApplication(payload, candidatePhoto, profileFile);

      try {
        const { sendAwardConfirmationEmail } = await import("@/services/emailService");
        await sendAwardConfirmationEmail({
          ...payload,
          id: result.id,
          registrationId: result.registrationId || result.id,
          category: payload.awardField,
        });
      } catch (emailError) {
        console.error("Failed to send Award email:", emailError);
      }

      await Swal.fire({
        html: `
          <div style="display:flex;flex-direction:column;align-items:center;gap:10px;padding:8px 4px;">
            <div style="width:56px;height:56px;border-radius:9999px;background:linear-gradient(135deg,#10b981,#059669);display:flex;align-items:center;justify-content:center;color:white;font-size:28px;font-weight:700;">&#10003;</div>
            <h2 style="margin:0;font-size:1.25rem;color:#111827;">Successfully Submitted</h2>
            <p style="margin:0;font-size:0.95rem;color:#4b5563;text-align:center;line-height:1.45;">
              Your award nomination has been received successfully.
            </p>
            <p style="margin:0;font-size:0.85rem;font-weight:600;color:#059669;">ID: ${result?.registrationId || result?.id || "Generating..."}</p>
          </div>
        `,
        showConfirmButton: false,
        timer: 1700,
        timerProgressBar: true,
        background: "#ffffff",
        allowOutsideClick: false,
        customClass: {
          popup: "rounded-2xl shadow-2xl",
        },
      });
      await showEntryPassAlert({
        registrationId: result?.registrationId || result?.id,
        name: payload?.name,
        theme: "amber",
      });
      router.push("/profile?tab=award");
    } catch (error) {
      console.error("Error submitting Award application:", error);
      await Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: error?.message || "Something went wrong. Please try again.",
        confirmButtonColor: "#f59e0b",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50 py-6 px-3 md:py-8 md:px-4">
      {/* Decorative Elements */}
      <div className="fixed top-0 left-0 w-48 h-48 bg-amber-200/30 rounded-full blur-3xl -z-10"></div>
      <div className="fixed bottom-0 right-0 w-64 h-64 bg-yellow-200/30 rounded-full blur-3xl -z-10"></div>
      
      <div className="max-w-4xl mx-auto">
        {/* Header with Festival Theme */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm border border-amber-200 mb-3">
            <Flower2 className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs font-medium text-amber-600">Raja Parba 2026</span>
            <Flower2 className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
            Awards Application
          </h1>
          <p className="text-sm text-gray-600 mt-1 max-w-2xl mx-auto">
            Nominate yourself for prestigious awards at Raja Parba 2026
          </p>
        </div>

        {/* Main Form Card */}
        <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-amber-200 overflow-hidden">
          {/* Decorative Top Border */}
          <div className="h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-600"></div>
          
          {/* Title Section with Background */}
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 px-5 py-3 border-b border-amber-200">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg shadow-md">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Nomination Details</h2>
                <p className="text-xs text-gray-600">Fill in your information to apply for awards</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="p-5 md:p-6">
            {/* Award Field & Photo in one row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {/* Award Field Dropdown */}
              <div className="self-start">
                <div className="relative">
                  <Medal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-400 z-10" />
                  <select
                    value={form.awardField}
                    onChange={(e) => updateField("awardField", e.target.value)}
                    className={`h-11 w-full rounded-lg border border-amber-200 bg-white pl-9 pr-8 text-sm leading-none text-gray-900 outline-none transition-all appearance-none ${primaryFocusClass}`}
                    required
                  >
                    <option value="" disabled className="text-gray-700">Select Award Field *</option>
                    {awardFieldOptions.map((option) => (
                      <option key={option.label} value={option.label} className="text-gray-900">
                        {option.icon} {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-400" />
                </div>
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  {awardFieldOptions.map((award, index) => (
                    <div
                      key={award.label}
                      className="rounded-lg border border-sky-300 bg-sky-50 p-2"
                    >
                      <p className="text-xs font-semibold text-sky-900">
                        {award.icon} {award.label}
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowAwardDetails(true)}
                        className="mt-1 inline-flex cursor-pointer items-center gap-1 text-[11px] font-semibold text-sky-700 underline underline-offset-2 hover:text-sky-900"
                      >
                        Learn more
                        <ChevronDown className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Photo Upload with Preview */}
              <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-semibold text-rose-700">Candidate Photo *</p>
                  <span className="rounded-full bg-rose-100/70 px-2 py-0.5 text-[10px] font-semibold text-rose-700">Required</span>
                </div>

                {photoPreview ? (
                  <div className="relative mx-auto h-24 w-24 rounded-xl overflow-hidden border border-rose-200 bg-white">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition shadow-md"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className="relative flex h-32 w-full flex-col items-center justify-center border border-dashed border-rose-300 rounded-xl bg-white cursor-pointer hover:bg-rose-50/60 transition group">
                    <Camera className="w-6 h-6 text-rose-500 group-hover:text-rose-600" />
                    <span className="mt-1.5 text-xs text-center text-rose-700 font-semibold px-2">
                      Upload candidate photo (Required)
                    </span>
                    <span className="mt-0.5 text-[11px] text-rose-500">JPG, PNG, WEBP (max 5MB)</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/jpg"
                      className="hidden"
                      onChange={(e) => handlePhotoChange(e.target.files?.[0] || null)}
                    />
                  </label>
                )}

                {photoError && (
                  <p className="mt-2 text-center text-xs font-semibold text-red-600">{photoError}</p>
                )}
                
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="mb-6">
              <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-amber-500" />
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Name */}
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className={`w-full rounded-lg border border-amber-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none transition-all ${primaryFocusClass}`}
                    required
                  />
                </div>

                {/* Phone */}
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className={`w-full rounded-lg border border-amber-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none transition-all ${primaryFocusClass}`}
                    required
                  />
                </div>

                {/* Email */}
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                  <input
                    type="email"
                    placeholder="Email Address *"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className={`w-full rounded-lg border border-amber-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none transition-all ${primaryFocusClass}`}
                    required
                  />
                </div>

                {/* Gender Dropdown */}
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-400 z-10" />
                  <select
                    value={form.gender}
                    onChange={(e) => updateField("gender", e.target.value)}
                    className={`h-11 w-full rounded-lg border border-amber-200 bg-white pl-9 pr-8 text-sm leading-none text-gray-700 outline-none transition-all appearance-none ${primaryFocusClass}`}
                    required
                  >
                    <option value="" disabled>Select Gender *</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-400" />
                </div>

                {/* Address - Full Width */}
                <div className="relative md:col-span-2">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-amber-400" />
                  <textarea
                    placeholder="Address *"
                    value={form.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    className={`w-full rounded-lg border border-amber-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none transition-all resize-none ${primaryFocusClass}`}
                    rows={2}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Pin, Education, Age in one row - No section title */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              {/* Pin Code */}
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-400" />
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Pin Code *"
                  value={form.pin}
                  onChange={(e) => updateField("pin", e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className={`w-full rounded-lg border border-orange-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none transition-all ${primaryFocusClass}`}
                  required
                />
              </div>

              {/* Education Qualification Dropdown */}
              <div className="relative">
                <GraduationCap className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-orange-400 z-10" />
                <select
                  value={form.educationQualification}
                  onChange={(e) => updateField("educationQualification", e.target.value)}
                  className={`h-11 w-full rounded-lg border border-orange-200 bg-white pl-9 pr-8 text-sm leading-none text-gray-700 outline-none transition-all appearance-none ${primaryFocusClass}`}
                  required
                >
                  <option value="" disabled>Select Education *</option>
                  {educationOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-orange-400" />
              </div>

              {/* Age */}
              <div className="relative">
                <Cake className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-400" />
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Age *"
                  value={form.age}
                  onChange={(e) => updateField("age", e.target.value.replace(/\D/g, ""))}
                  className={`w-full rounded-lg border border-orange-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none transition-all ${primaryFocusClass}`}
                  required
                />
              </div>
            </div>

            {/* About Self Section */}
            <div className="mb-6">
              <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-yellow-500" />
                About Yourself
              </h3>
              
              <div>
                <textarea
                  value={form.aboutSelf}
                  onChange={(e) => handleAboutChange(e.target.value)}
                  rows={4}
                  className={`w-full rounded-lg border border-yellow-200 bg-white py-2.5 px-3 text-sm text-gray-700 outline-none transition-all resize-none ${primaryFocusClass}`}
                  placeholder="Tell us about yourself, your achievements, and why you deserve this award... *"
                  required
                />
                <p className={`mt-1 text-xs ${aboutWordCount >= 100 ? "text-red-600" : "text-yellow-600"}`}>
                  {aboutWordCount}/100 words
                </p>
              </div>
            </div>

            {/* Upload profile moved to end, after About Yourself */}
            <div className="mb-6">
              <label className="mb-1.5 block text-[15px] font-semibold text-amber-700">
                Upload your profile (Optional)
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,image/jpeg,image/jpg,image/png,image/webp"
                className={`block w-full cursor-pointer rounded-md border border-amber-300 bg-white px-2.5 py-2 text-xs text-gray-700 file:mr-2 file:rounded file:border-0 file:bg-amber-100 file:px-2 file:py-1 file:text-xs file:font-semibold file:text-amber-700 hover:file:bg-amber-200 outline-none ${primaryFocusClass}`}
                onChange={(e) => handleProfileFileChange(e.target.files?.[0] || null)}
              />
              {profileFile && (
                <p className="mt-1 text-[11px] text-gray-600 truncate">{profileFile.name}</p>
              )}
            </div>

            {/* Submit Button - Centered */}
            <div className="flex justify-center pt-4 border-t border-amber-200">
              <button
                type="submit"
                disabled={submitting}
                className="group cursor-pointer relative px-8 py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-white font-medium text-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Submit Nomination</span>
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </form>
        </div>

        {showAwardDetails && (
          <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-3"
            onClick={() => setShowAwardDetails(false)}
          >
            <div
              className="w-full max-w-3xl rounded-2xl border border-amber-200 bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-amber-200 px-4 py-3">
                <h3 className="text-base font-bold text-gray-900">Awards Details</h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 p-1">
                    {["odia", "english", "hindi"].map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setAwardDetailLang(lang)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                          awardDetailLang === lang
                            ? "bg-amber-500 text-white"
                            : "text-gray-700 hover:bg-amber-100"
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAwardDetails(false)}
                    className="rounded-full border border-gray-200 p-1.5 text-gray-600 hover:bg-gray-100"
                    aria-label="Close award details"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="max-h-[70vh] space-y-4 overflow-y-auto px-4 py-4">
                {awardDetailsByLanguage[awardDetailLang]?.map((item) => (
                  <div key={item.title} className="rounded-xl border border-amber-100 bg-amber-50/40 p-3">
                    <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                    <p className="mt-1 text-sm leading-6 text-gray-700">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer Note */}
        <p className="text-center text-xs text-gray-500 mt-4">
          ✨ Our team will review your nomination and contact you within 24-48 hours
        </p>
      </div>
    </div>
  );
}
