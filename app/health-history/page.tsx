"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const STORAGE_KEY_HEALTH_DONE = "hmr_health_history_completed";

type YesNo = "yes" | "no" | "";

const ASPECT_OPTIONS = [
  "Core Stability",
  "Flexibility",
  "Posture",
  "Toning",
  "Strength",
  "Stress Management",
  "Relaxation",
] as const;

const DELIVERY_OPTIONS = ["Normal", "Ventouse", "Forceps", "Caesarean"] as const;

const POSTNATAL_CONDITIONS = [
  "Pelvic girdle pain",
  "Osteitis pubis",
  "Diastasis pubis",
  "Urinary incontinence",
  "Faecal incontinence",
  "Postnatal depression",
] as const;

type FormState = {
  // Intro
  donePilatesBefore: YesNo;
  whyCommencePilates: string;
  aspectConcentrate: string[];
  aim1: string;
  aim2: string;
  aim3: string;
  // Lifestyle
  occupation: string;
  repetitiveProlonged: YesNo;
  repetitiveDetail: string;
  sportsHobbies: string;
  // Conditions (each Yes/No + optional detail)
  lowBackPain: YesNo;
  lowBackPainDetail: string;
  pelvicPain: YesNo;
  pelvicPainDetail: string;
  otherSpinal: YesNo;
  otherSpinalDetail: string;
  otherJoint: YesNo;
  otherJointDetail: string;
  heartProblems: YesNo;
  heartProblemsDetail: string;
  bloodPressure: YesNo;
  bloodPressureDetail: string;
  epilepsy: YesNo;
  epilepsyDetail: string;
  asthmaLung: YesNo;
  asthmaLungDetail: string;
  diabetes: YesNo;
  diabetesDetail: string;
  depression: YesNo;
  depressionDetail: string;
  cancer: YesNo;
  cancerDetail: string;
  stroke: YesNo;
  strokeDetail: string;
  latexAllergy: YesNo;
  latexAllergyDetail: string;
  recentSurgeryOther: string;
  // Antenatal (if pregnant)
  antenatalDiabetes: YesNo;
  antenatalDiabetesDetail: string;
  antenatalAbnormalBleeding: YesNo;
  antenatalPreeclampsia: YesNo;
  antenatalIncompetentCervix: YesNo;
  antenatalMiscarriage: YesNo;
  antenatalAnaemia: YesNo;
  antenatalPlacenta: YesNo;
  antenatalEpilepsy: YesNo;
  antenatalOther: string;
  // Pregnancy
  pregnantOrPostnatal: YesNo;
  weeksPregnant: string;
  dueDate: string;
  childrenBirthCount: string;
  twinsMultiples: YesNo;
  twinsDetail: string;
  pregnancyComplications: YesNo;
  pregnancyComplicationsDetail: string;
  pelvicGirdlePain: YesNo;
  pelvicGirdlePainDetail: string;
  lowBackPainPregnancy: YesNo;
  lowBackPainPregnancyDetail: string;
  backPainOutsidePregnancy: YesNo;
  backPainOutsideCount: string;
  // Postnatal
  lastBirthDate: string;
  deliveryType: string;
  priorCaesareans: YesNo;
  priorCaesareansDetail: string;
  postnatalConditions: string[];
};

const initialForm: FormState = {
  donePilatesBefore: "",
  whyCommencePilates: "",
  aspectConcentrate: [],
  aim1: "",
  aim2: "",
  aim3: "",
  occupation: "",
  repetitiveProlonged: "",
  repetitiveDetail: "",
  sportsHobbies: "",
  lowBackPain: "",
  lowBackPainDetail: "",
  pelvicPain: "",
  pelvicPainDetail: "",
  otherSpinal: "",
  otherSpinalDetail: "",
  otherJoint: "",
  otherJointDetail: "",
  heartProblems: "",
  heartProblemsDetail: "",
  bloodPressure: "",
  bloodPressureDetail: "",
  epilepsy: "",
  epilepsyDetail: "",
  asthmaLung: "",
  asthmaLungDetail: "",
  diabetes: "",
  diabetesDetail: "",
  depression: "",
  depressionDetail: "",
  cancer: "",
  cancerDetail: "",
  stroke: "",
  strokeDetail: "",
  latexAllergy: "",
  latexAllergyDetail: "",
  recentSurgeryOther: "",
  antenatalDiabetes: "",
  antenatalDiabetesDetail: "",
  antenatalAbnormalBleeding: "",
  antenatalPreeclampsia: "",
  antenatalIncompetentCervix: "",
  antenatalMiscarriage: "",
  antenatalAnaemia: "",
  antenatalPlacenta: "",
  antenatalEpilepsy: "",
  antenatalOther: "",
  pregnantOrPostnatal: "",
  weeksPregnant: "",
  dueDate: "",
  childrenBirthCount: "",
  twinsMultiples: "",
  twinsDetail: "",
  pregnancyComplications: "",
  pregnancyComplicationsDetail: "",
  pelvicGirdlePain: "",
  pelvicGirdlePainDetail: "",
  lowBackPainPregnancy: "",
  lowBackPainPregnancyDetail: "",
  backPainOutsidePregnancy: "",
  backPainOutsideCount: "",
  lastBirthDate: "",
  deliveryType: "",
  priorCaesareans: "",
  priorCaesareansDetail: "",
  postnatalConditions: [],
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="hmr-card p-6">
      <h2 className="hmr-display text-lg text-[var(--hmr-deep)] mb-4">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function YesNoRow({
  name,
  label,
  value,
  onChange,
  detailValue,
  detailOnChange,
  detailPlaceholder,
}: {
  name: string;
  label: string;
  value: YesNo;
  onChange: (v: YesNo) => void;
  detailValue?: string;
  detailOnChange?: (v: string) => void;
  detailPlaceholder?: string;
}) {
  return (
    <div className="border-b border-[var(--hmr-card-border)] pb-4 last:border-0">
      <p className="text-sm font-medium text-[var(--hmr-deep)] mb-2">{label}</p>
      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name={name}
            checked={value === "yes"}
            onChange={() => onChange("yes")}
            className="text-[var(--hmr-primary)]"
          />
          <span className="text-sm">Yes</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name={name}
            checked={value === "no"}
            onChange={() => onChange("no")}
            className="text-[var(--hmr-primary)]"
          />
          <span className="text-sm">No</span>
        </label>
      </div>
      {value === "yes" && detailOnChange && (
        <div className="mt-2">
          <textarea
            value={detailValue ?? ""}
            onChange={(e) => detailOnChange(e.target.value)}
            placeholder={detailPlaceholder ?? "Please give as much detail as possible…"}
            rows={2}
            className="mt-1 w-full rounded-[var(--hmr-radius-sm)] border border-[var(--hmr-neutral)]/50 bg-white px-4 py-2.5 text-sm text-[var(--hmr-black)]"
          />
        </div>
      )}
    </div>
  );
}

function CheckboxGroup({
  options,
  selected,
  onChange,
  label,
}: {
  label: string;
  options: readonly string[];
  selected: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (opt: string) => {
    if (selected.includes(opt)) onChange(selected.filter((x) => x !== opt));
    else onChange([...selected, opt]);
  };
  return (
    <div>
      <p className="text-sm font-medium text-[var(--hmr-deep)] mb-2">{label}</p>
      <div className="flex flex-wrap gap-3">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={() => toggle(opt)}
              className="rounded border-[var(--hmr-neutral)] text-[var(--hmr-primary)]"
            />
            <span className="text-sm">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default function HealthHistoryPage() {
  const sessionResult = useSession();
  const session = sessionResult?.data ?? null;
  const status = sessionResult?.status ?? "loading";
  const [completed, setCompleted] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    setCompleted(localStorage.getItem(STORAGE_KEY_HEALTH_DONE) === "true");
  }, []);

  useEffect(() => {
    if (status !== "authenticated" || completed !== false) return;
    fetch("/api/health-history")
      .then((r) => r.ok ? r.json() : [])
      .then((list) => {
        if (Array.isArray(list) && list.length > 0) {
          setCompleted(true);
        }
      })
      .catch(() => {});
  }, [status, completed]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError("");
    if (status !== "authenticated" || !session?.user) {
      setSubmitError("Please sign in to submit your health history.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/health-history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setSubmitError(data.error || "Failed to submit. Please try again.");
        return;
      }
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY_HEALTH_DONE, "true");
        localStorage.setItem("hmr_health_history_data", JSON.stringify(form));
      }
      setCompleted(true);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  const showPregnancySections = form.pregnantOrPostnatal === "yes";

  if (completed === null) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center text-[var(--hmr-bg-text)]/80">
        Loading…
      </div>
    );
  }

  if (completed && submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <div className="hmr-card bg-[var(--hmr-light)]/50 p-8 text-center">
          <h1 className="hmr-display text-2xl text-[var(--hmr-deep)]">
            Health history submitted
          </h1>
          <p className="mt-2 text-xl font-medium text-[var(--hmr-black)]/90">
            Thank you. We&apos;ve saved your information.
          </p>
          <Link
            href="/"
            className="hmr-btn-primary mt-6 inline-block px-6 py-2.5 text-sm"
          >
            Back to calendar
          </Link>
        </div>
      </div>
    );
  }

  if (completed && !submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <div className="hmr-card p-8">
          <h1 className="hmr-display text-2xl text-[var(--hmr-deep)]">
            Health history already completed
          </h1>
          <p className="mt-2 text-zinc-600">
            You only need to complete this form once. We have your information on file.
          </p>
          <Link
            href="/"
            className="hmr-btn-primary mt-6 inline-block px-6 py-2.5 text-sm"
          >
            Back to calendar
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:py-12">
      <h1 className="hmr-display text-3xl sm:text-4xl">
        New member health history
      </h1>
      <p className="mt-2 text-[var(--hmr-bg-text)]/90">
        Please complete this form once before your first session.
      </p>
      {status === "authenticated" ? null : (
        <div className="mt-4 hmr-card p-4 bg-[var(--hmr-light)]/80 border border-[var(--hmr-primary)]/30">
          <p className="text-sm text-[var(--hmr-deep)]">
            You need to be signed in to submit your health history.{" "}
            <Link href={`/login?callbackUrl=${encodeURIComponent("/health-history")}`} className="font-medium text-[var(--hmr-primary)] underline">
              Sign in
            </Link>
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        {/* Intro */}
        <Section title="Introduction">
          <div>
            <p className="text-sm font-medium text-[var(--hmr-deep)] mb-2">Have you done Pilates before?</p>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="donePilates"
                  checked={form.donePilatesBefore === "yes"}
                  onChange={() => update("donePilatesBefore", "yes")}
                  className="text-[var(--hmr-primary)]"
                />
                <span className="text-sm">Yes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="donePilates"
                  checked={form.donePilatesBefore === "no"}
                  onChange={() => update("donePilatesBefore", "no")}
                  className="text-[var(--hmr-primary)]"
                />
                <span className="text-sm">No</span>
              </label>
            </div>
          </div>
          <div>
            <label htmlFor="whyCommence" className="block text-sm font-medium text-[var(--hmr-deep)] mb-1">
              Why have you decided to commence Pilates?
            </label>
            <textarea
              id="whyCommence"
              rows={3}
              value={form.whyCommencePilates}
              onChange={(e) => update("whyCommencePilates", e.target.value)}
              className="w-full rounded-[var(--hmr-radius-sm)] border border-[var(--hmr-neutral)]/50 bg-white px-4 py-2.5 text-[var(--hmr-black)]"
            />
          </div>
          <CheckboxGroup
            label="What aspect of your health would you like to concentrate on?"
            options={ASPECT_OPTIONS}
            selected={form.aspectConcentrate}
            onChange={(v) => update("aspectConcentrate", v)}
          />
          <div>
            <label className="block text-sm font-medium text-[var(--hmr-deep)] mb-2">
              What are the 3 main aims you hope to achieve with your Pilates programme?
            </label>
            <div className="space-y-3">
              <input
                type="text"
                value={form.aim1}
                onChange={(e) => update("aim1", e.target.value)}
                placeholder="1."
                className="w-full rounded-[var(--hmr-radius-sm)] border border-[var(--hmr-neutral)]/50 bg-white px-4 py-2.5 text-[var(--hmr-black)]"
              />
              <input
                type="text"
                value={form.aim2}
                onChange={(e) => update("aim2", e.target.value)}
                placeholder="2."
                className="w-full rounded-[var(--hmr-radius-sm)] border border-[var(--hmr-neutral)]/50 bg-white px-4 py-2.5 text-[var(--hmr-black)]"
              />
              <input
                type="text"
                value={form.aim3}
                onChange={(e) => update("aim3", e.target.value)}
                placeholder="3."
                className="w-full rounded-[var(--hmr-radius-sm)] border border-[var(--hmr-neutral)]/50 bg-white px-4 py-2.5 text-[var(--hmr-black)]"
              />
            </div>
          </div>
        </Section>

        {/* Lifestyle */}
        <Section title="LIFESTYLE">
          <div>
            <label htmlFor="occupation" className="block text-sm font-medium text-[var(--hmr-deep)] mb-1">
              What is your occupation?
            </label>
            <input
              id="occupation"
              type="text"
              value={form.occupation}
              onChange={(e) => update("occupation", e.target.value)}
              className="w-full rounded-[var(--hmr-radius-sm)] border border-[var(--hmr-neutral)]/50 bg-white px-4 py-2.5 text-[var(--hmr-black)]"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--hmr-deep)] mb-2">
              Does your occupation involve any repetitive movements, or prolonged postures?
            </p>
            <div className="flex gap-6 mb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="repetitive"
                  checked={form.repetitiveProlonged === "yes"}
                  onChange={() => update("repetitiveProlonged", "yes")}
                  className="text-[var(--hmr-primary)]"
                />
                <span className="text-sm">Yes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="repetitive"
                  checked={form.repetitiveProlonged === "no"}
                  onChange={() => update("repetitiveProlonged", "no")}
                  className="text-[var(--hmr-primary)]"
                />
                <span className="text-sm">No</span>
              </label>
            </div>
            {form.repetitiveProlonged === "yes" && (
              <textarea
                value={form.repetitiveDetail}
                onChange={(e) => update("repetitiveDetail", e.target.value)}
                placeholder="If YES, please explain briefly."
                rows={2}
                className="w-full rounded-[var(--hmr-radius-sm)] border border-[var(--hmr-neutral)]/50 bg-white px-4 py-2.5 text-[var(--hmr-black)]"
              />
            )}
          </div>
          <div>
            <label htmlFor="sportsHobbies" className="block text-sm font-medium text-[var(--hmr-deep)] mb-1">
              What other sports and hobbies are you involved with?
            </label>
            <textarea
              id="sportsHobbies"
              rows={2}
              value={form.sportsHobbies}
              onChange={(e) => update("sportsHobbies", e.target.value)}
              className="w-full rounded-[var(--hmr-radius-sm)] border border-[var(--hmr-neutral)]/50 bg-white px-4 py-2.5 text-[var(--hmr-black)]"
            />
          </div>
        </Section>

        {/* Conditions */}
        <Section title="Are you currently experiencing any of the following conditions?">
          <p className="text-sm text-[var(--hmr-text-muted)] mb-4">
            Please give as much detail as possible on any conditions you have marked Yes.
          </p>
          <YesNoRow
            name="cond-lowBackPain"
            label="Low back pain"
            value={form.lowBackPain}
            onChange={(v) => update("lowBackPain", v)}
            detailValue={form.lowBackPainDetail}
            detailOnChange={(v) => update("lowBackPainDetail", v)}
          />
          <YesNoRow
            name="cond-pelvicPain"
            label="Pelvic pain"
            value={form.pelvicPain}
            onChange={(v) => update("pelvicPain", v)}
            detailValue={form.pelvicPainDetail}
            detailOnChange={(v) => update("pelvicPainDetail", v)}
          />
          <YesNoRow
            name="cond-otherSpinal"
            label="Any other spinal condition"
            value={form.otherSpinal}
            onChange={(v) => update("otherSpinal", v)}
            detailValue={form.otherSpinalDetail}
            detailOnChange={(v) => update("otherSpinalDetail", v)}
          />
          <YesNoRow
            name="cond-otherJoint"
            label="Any other joint conditions"
            value={form.otherJoint}
            onChange={(v) => update("otherJoint", v)}
            detailValue={form.otherJointDetail}
            detailOnChange={(v) => update("otherJointDetail", v)}
          />
          <YesNoRow
            name="cond-heartProblems"
            label="Heart problems"
            value={form.heartProblems}
            onChange={(v) => update("heartProblems", v)}
            detailValue={form.heartProblemsDetail}
            detailOnChange={(v) => update("heartProblemsDetail", v)}
          />
          <YesNoRow
            name="cond-bloodPressure"
            label="High or low blood pressure"
            value={form.bloodPressure}
            onChange={(v) => update("bloodPressure", v)}
            detailValue={form.bloodPressureDetail}
            detailOnChange={(v) => update("bloodPressureDetail", v)}
          />
          <YesNoRow
            name="cond-epilepsy"
            label="Epilepsy (Grand Mal Seizures)"
            value={form.epilepsy}
            onChange={(v) => update("epilepsy", v)}
            detailValue={form.epilepsyDetail}
            detailOnChange={(v) => update("epilepsyDetail", v)}
          />
          <YesNoRow
            name="cond-asthmaLung"
            label="Asthma/lung conditions"
            value={form.asthmaLung}
            onChange={(v) => update("asthmaLung", v)}
            detailValue={form.asthmaLungDetail}
            detailOnChange={(v) => update("asthmaLungDetail", v)}
          />
          <YesNoRow
            name="cond-diabetes"
            label="Diabetes"
            value={form.diabetes}
            onChange={(v) => update("diabetes", v)}
            detailValue={form.diabetesDetail}
            detailOnChange={(v) => update("diabetesDetail", v)}
          />
          <YesNoRow
            name="cond-depression"
            label="Depression"
            value={form.depression}
            onChange={(v) => update("depression", v)}
            detailValue={form.depressionDetail}
            detailOnChange={(v) => update("depressionDetail", v)}
          />
          <YesNoRow
            name="cond-cancer"
            label="Cancer"
            value={form.cancer}
            onChange={(v) => update("cancer", v)}
            detailValue={form.cancerDetail}
            detailOnChange={(v) => update("cancerDetail", v)}
          />
          <YesNoRow
            name="cond-stroke"
            label="Stroke"
            value={form.stroke}
            onChange={(v) => update("stroke", v)}
            detailValue={form.strokeDetail}
            detailOnChange={(v) => update("strokeDetail", v)}
          />
          <YesNoRow
            name="cond-latexAllergy"
            label="Latex allergy"
            value={form.latexAllergy}
            onChange={(v) => update("latexAllergy", v)}
            detailValue={form.latexAllergyDetail}
            detailOnChange={(v) => update("latexAllergyDetail", v)}
          />
          <div className="pt-2">
            <label htmlFor="recentSurgery" className="block text-sm font-medium text-[var(--hmr-deep)] mb-1">
              Any recent surgery or other medical conditions not mentioned above? Please give detail.
            </label>
            <textarea
              id="recentSurgery"
              rows={3}
              value={form.recentSurgeryOther}
              onChange={(e) => update("recentSurgeryOther", e.target.value)}
              className="w-full rounded-[var(--hmr-radius-sm)] border border-[var(--hmr-neutral)]/50 bg-white px-4 py-2.5 text-[var(--hmr-black)]"
            />
          </div>
        </Section>

        {/* Gate: Pregnant or up to 1 year postnatal */}
        <Section title="Pregnancy / Postnatal">
          <p className="text-sm font-medium text-[var(--hmr-deep)] mb-2">
            Are you currently pregnant or up to 1 year postnatal?
          </p>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="pregnantPostnatal"
                checked={form.pregnantOrPostnatal === "yes"}
                onChange={() => update("pregnantOrPostnatal", "yes")}
                className="text-[var(--hmr-primary)]"
              />
              <span className="text-sm">Yes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="pregnantPostnatal"
                checked={form.pregnantOrPostnatal === "no"}
                onChange={() => update("pregnantOrPostnatal", "no")}
                className="text-[var(--hmr-primary)]"
              />
              <span className="text-sm">No</span>
            </label>
          </div>
        </Section>

        {showPregnancySections && (
          <>
            {/* ANTENATAL */}
            <Section title="ANTENATAL (Only complete if pregnant)">
              <YesNoRow
                name="ant-diabetes"
                label="Diabetes"
                value={form.antenatalDiabetes}
                onChange={(v) => update("antenatalDiabetes", v)}
                detailValue={form.antenatalDiabetesDetail}
                detailOnChange={(v) => update("antenatalDiabetesDetail", v)}
                detailPlaceholder="If YES, please give further details."
              />
              <YesNoRow name="ant-bleeding" label="Abnormal Vaginal bleeding" value={form.antenatalAbnormalBleeding} onChange={(v) => update("antenatalAbnormalBleeding", v)} />
              <YesNoRow name="ant-preeclampsia" label="Pre-eclampsia" value={form.antenatalPreeclampsia} onChange={(v) => update("antenatalPreeclampsia", v)} />
              <YesNoRow name="ant-cervix" label="Incompetent cervix" value={form.antenatalIncompetentCervix} onChange={(v) => update("antenatalIncompetentCervix", v)} />
              <YesNoRow name="ant-miscarriage" label="History of spontaneous miscarriage" value={form.antenatalMiscarriage} onChange={(v) => update("antenatalMiscarriage", v)} />
              <YesNoRow name="ant-anaemia" label="Anaemia" value={form.antenatalAnaemia} onChange={(v) => update("antenatalAnaemia", v)} />
              <YesNoRow name="ant-placenta" label="Abnormal Placenta function or position" value={form.antenatalPlacenta} onChange={(v) => update("antenatalPlacenta", v)} />
              <YesNoRow name="ant-epilepsy" label="Epilepsy (Grand Mal Seizures)" value={form.antenatalEpilepsy} onChange={(v) => update("antenatalEpilepsy", v)} />
              <div>
                <label className="block text-sm font-medium text-[var(--hmr-deep)] mb-1">
                  Any other medical conditions that you have been diagnosed with or have had treatment for:
                </label>
                <textarea
                  rows={3}
                  value={form.antenatalOther}
                  onChange={(e) => update("antenatalOther", e.target.value)}
                  className="w-full rounded-[var(--hmr-radius-sm)] border border-[var(--hmr-neutral)]/50 bg-white px-4 py-2.5 text-[var(--hmr-black)]"
                />
              </div>
            </Section>

            {/* PREGNANCY */}
            <Section title="PREGNANCY (Please complete if pregnant or up to 1 year postnatal)">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-[var(--hmr-deep)] mb-1">How many weeks pregnant are you?</label>
                  <input
                    type="text"
                    value={form.weeksPregnant}
                    onChange={(e) => update("weeksPregnant", e.target.value)}
                    className="w-full rounded-[var(--hmr-radius-sm)] border border-[var(--hmr-neutral)]/50 bg-white px-4 py-2.5 text-[var(--hmr-black)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--hmr-deep)] mb-1">What is your due date?</label>
                  <input
                    type="text"
                    value={form.dueDate}
                    onChange={(e) => update("dueDate", e.target.value)}
                    placeholder="e.g. DD/MM/YYYY"
                    className="w-full rounded-[var(--hmr-radius-sm)] border border-[var(--hmr-neutral)]/50 bg-white px-4 py-2.5 text-[var(--hmr-black)]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--hmr-deep)] mb-1">How many children have you given birth to?</label>
                <input
                  type="text"
                  value={form.childrenBirthCount}
                  onChange={(e) => update("childrenBirthCount", e.target.value)}
                  className="w-full rounded-[var(--hmr-radius-sm)] border border-[var(--hmr-neutral)]/50 bg-white px-4 py-2.5 text-[var(--hmr-black)]"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--hmr-deep)] mb-2">Have you had twins/triplets etc?</p>
                <div className="flex gap-6 mb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="twins" checked={form.twinsMultiples === "yes"} onChange={() => update("twinsMultiples", "yes")} className="text-[var(--hmr-primary)]" />
                    <span className="text-sm">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="twins" checked={form.twinsMultiples === "no"} onChange={() => update("twinsMultiples", "no")} className="text-[var(--hmr-primary)]" />
                    <span className="text-sm">No</span>
                  </label>
                </div>
                {form.twinsMultiples === "yes" && (
                  <textarea
                    value={form.twinsDetail}
                    onChange={(e) => update("twinsDetail", e.target.value)}
                    placeholder="If so, please give details."
                    rows={2}
                    className="w-full rounded-[var(--hmr-radius-sm)] border border-[var(--hmr-neutral)]/50 bg-white px-4 py-2.5 text-[var(--hmr-black)]"
                  />
                )}
              </div>
              <YesNoRow
                name="preg-complications"
                label="Have you had any complications in any of your pregnancies? If so, please explain."
                value={form.pregnancyComplications}
                onChange={(v) => update("pregnancyComplications", v)}
                detailValue={form.pregnancyComplicationsDetail}
                detailOnChange={(v) => update("pregnancyComplicationsDetail", v)}
              />
              <YesNoRow
                name="preg-pelvicGirdle"
                label="Have you ever suffered from pelvic girdle pain? (formerly known as SPD or syphysis pubis dysfunction) If so, when and for how long?"
                value={form.pelvicGirdlePain}
                onChange={(v) => update("pelvicGirdlePain", v)}
                detailValue={form.pelvicGirdlePainDetail}
                detailOnChange={(v) => update("pelvicGirdlePainDetail", v)}
              />
              <YesNoRow
                name="preg-lowBack"
                label="Have you ever had an episode of low back pain during pregnancy? If so, when and for how long?"
                value={form.lowBackPainPregnancy}
                onChange={(v) => update("lowBackPainPregnancy", v)}
                detailValue={form.lowBackPainPregnancyDetail}
                detailOnChange={(v) => update("lowBackPainPregnancyDetail", v)}
              />
              <YesNoRow
                name="preg-backOutside"
                label="Have you had episodes of back pain outside of pregnancy? If so, how many?"
                value={form.backPainOutsidePregnancy}
                onChange={(v) => update("backPainOutsidePregnancy", v)}
                detailValue={form.backPainOutsideCount}
                detailOnChange={(v) => update("backPainOutsideCount", v)}
              />
            </Section>

            {/* POSTNATAL */}
            <Section title="POSTNATAL (Please complete if up to 1 year postnatal)">
              <div>
                <label className="block text-sm font-medium text-[var(--hmr-deep)] mb-1">When did you last give birth?</label>
                <input
                  type="text"
                  value={form.lastBirthDate}
                  onChange={(e) => update("lastBirthDate", e.target.value)}
                  placeholder="e.g. DD/MM/YYYY"
                  className="w-full rounded-[var(--hmr-radius-sm)] border border-[var(--hmr-neutral)]/50 bg-white px-4 py-2.5 text-[var(--hmr-black)]"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--hmr-deep)] mb-2">What type of delivery was it?</p>
                <div className="flex flex-wrap gap-4">
                  {DELIVERY_OPTIONS.map((opt) => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="deliveryType"
                        checked={form.deliveryType === opt}
                        onChange={() => update("deliveryType", opt)}
                        className="text-[var(--hmr-primary)]"
                      />
                      <span className="text-sm">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
              <YesNoRow
                name="post-priorCaesareans"
                label="Have you ever had a caesarean prior to this birth? If so how many and when?"
                value={form.priorCaesareans}
                onChange={(v) => update("priorCaesareans", v)}
                detailValue={form.priorCaesareansDetail}
                detailOnChange={(v) => update("priorCaesareansDetail", v)}
              />
              <div>
                <p className="text-sm font-medium text-[var(--hmr-deep)] mb-2">Tick if you are suffering with any of the following:</p>
                <div className="flex flex-wrap gap-4">
                  {POSTNATAL_CONDITIONS.map((opt) => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.postnatalConditions.includes(opt)}
                        onChange={() => {
                          if (form.postnatalConditions.includes(opt)) {
                            update("postnatalConditions", form.postnatalConditions.filter((x) => x !== opt));
                          } else {
                            update("postnatalConditions", [...form.postnatalConditions, opt]);
                          }
                        }}
                        className="rounded border-[var(--hmr-neutral)] text-[var(--hmr-primary)]"
                      />
                      <span className="text-sm">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            </Section>
          </>
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {submitError && (
          <p className="text-sm text-red-600 dark:text-red-400 w-full sm:w-auto">{submitError}</p>
        )}
        <button
          type="submit"
          disabled={submitting || status !== "authenticated"}
          className="hmr-btn-primary w-full py-3 sm:w-auto sm:px-8 disabled:opacity-50"
        >
          {submitting ? "Submitting…" : "Submit health history"}
        </button>
          <Link
            href="/"
            className="text-center text-sm text-[var(--hmr-deep)]/80 underline hover:text-[var(--hmr-primary)]"
          >
            Back to calendar
          </Link>
        </div>
      </form>
    </div>
  );
}
