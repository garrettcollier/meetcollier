"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { TurnstileWidget } from "@/components/assistance/turnstile-widget";
import { Button } from "@/components/ui/button";
import {
  assistanceCategories,
  assistanceRequestSchema,
  type AssistanceRequest,
} from "@/modules/constituent-intake/domain/assistance-request";

type FormInput = z.input<typeof assistanceRequestSchema>;

type AssistanceFormProps = {
  enabled: boolean;
  siteKey: string;
};

type ApiResponse = {
  fieldErrors?: Record<string, string[]>;
  message?: string;
  referenceId?: string;
};

const inputClassName =
  "mt-2 w-full rounded-xl border border-navy-900/20 bg-white px-4 py-3 text-base text-navy-950 outline-none transition placeholder:text-navy-500 focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20 disabled:cursor-not-allowed disabled:bg-navy-50";
const labelClassName = "block text-sm font-bold text-navy-950";
const errorClassName = "mt-2 text-sm font-semibold text-red-700";

export function AssistanceForm({ enabled, siteKey }: AssistanceFormProps) {
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
    setValue,
  } = useForm<FormInput, unknown, AssistanceRequest>({
    resolver: zodResolver(assistanceRequestSchema),
    defaultValues: {
      category: "general_question",
      description: "",
      email: "",
      generalLocation: "",
      name: "",
      officialServiceRequestReference: "",
      phone: "",
      preferredContactMethod: "email",
      subject: "",
      turnstileToken: "",
      website: "",
    },
  });

  const handleTurnstileToken = useCallback(
    (token: string) => {
      setValue("turnstileToken", token, { shouldValidate: true });
    },
    [setValue],
  );

  const onSubmit = handleSubmit(async (values) => {
    setFormMessage(null);

    try {
      const response = await fetch("/api/assistance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = (await response.json()) as ApiResponse;

      if (!response.ok) {
        Object.entries(result.fieldErrors ?? {}).forEach(([field, messages]) => {
          const message = messages?.[0];
          if (message) {
            setError(field as keyof FormInput, { type: "server", message });
          }
        });
        setFormMessage(result.message ?? "Your request could not be submitted.");
        setTurnstileResetKey((value) => value + 1);
        return;
      }

      setReferenceId(result.referenceId ?? null);
    } catch {
      setFormMessage("The service could not be reached. Please use the phone or email contact option.");
      setTurnstileResetKey((value) => value + 1);
    }
  });

  if (referenceId) {
    return (
      <div className="rounded-3xl border border-green-800/20 bg-green-50 p-7 text-green-950 sm:p-9" role="status">
        <CheckCircle2 aria-hidden="true" className="size-8 text-green-700" />
        <h2 className="mt-5 font-serif text-3xl font-semibold">Your request was received.</h2>
        <p className="mt-4 text-base leading-7">Reference: <strong className="font-mono">{referenceId}</strong></p>
        <p className="mt-3 max-w-2xl text-sm leading-6">Keep this reference for your records. It cannot be used to retrieve private case details publicly. This submission does not create an official City work order.</p>
      </div>
    );
  }

  return (
    <form className="rounded-3xl border border-navy-900/10 bg-warm-50 p-6 sm:p-9" noValidate onSubmit={onSubmit}>
      <div className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Secure request form</p>
        <h2 className="mt-4 font-serif text-3xl font-semibold text-navy-950">Share a question or request for help.</h2>
        <p className="mt-3 text-sm leading-6 text-navy-700">Provide only what is needed to understand and respond. Do not include Social Security numbers, financial account information, medical records, or other highly sensitive information.</p>
      </div>

      <fieldset className="mt-8 space-y-7" disabled={!enabled || isSubmitting}>
        <legend className="sr-only">Request details</legend>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className={labelClassName} htmlFor="name">Name <span aria-hidden="true">*</span></label>
            <input {...register("name")} autoComplete="name" className={inputClassName} id="name" aria-invalid={Boolean(errors.name)} />
            {errors.name ? <p className={errorClassName} role="alert">{errors.name.message}</p> : null}
          </div>
          <div>
            <label className={labelClassName} htmlFor="preferredContactMethod">Preferred contact method <span aria-hidden="true">*</span></label>
            <select {...register("preferredContactMethod")} className={inputClassName} id="preferredContactMethod" aria-invalid={Boolean(errors.preferredContactMethod)}>
              <option value="email">Email</option>
              <option value="text">Text message</option>
              <option value="phone">Phone call</option>
            </select>
            {errors.preferredContactMethod ? <p className={errorClassName} role="alert">{errors.preferredContactMethod.message}</p> : null}
          </div>
          <div>
            <label className={labelClassName} htmlFor="email">Email</label>
            <input {...register("email")} autoComplete="email" className={inputClassName} id="email" inputMode="email" type="email" aria-invalid={Boolean(errors.email)} />
            {errors.email ? <p className={errorClassName} role="alert">{errors.email.message}</p> : null}
          </div>
          <div>
            <label className={labelClassName} htmlFor="phone">Phone</label>
            <input {...register("phone")} autoComplete="tel" className={inputClassName} id="phone" inputMode="tel" type="tel" aria-invalid={Boolean(errors.phone)} />
            {errors.phone ? <p className={errorClassName} role="alert">{errors.phone.message}</p> : null}
          </div>
          <div>
            <label className={labelClassName} htmlFor="generalLocation">General location or district <span className="font-normal text-navy-600">(optional)</span></label>
            <input {...register("generalLocation")} className={inputClassName} id="generalLocation" placeholder="Neighborhood or District 5" aria-invalid={Boolean(errors.generalLocation)} />
            {errors.generalLocation ? <p className={errorClassName} role="alert">{errors.generalLocation.message}</p> : null}
          </div>
          <div>
            <label className={labelClassName} htmlFor="category">Issue category <span aria-hidden="true">*</span></label>
            <select {...register("category")} className={inputClassName} id="category" aria-invalid={Boolean(errors.category)}>
              {assistanceCategories.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            {errors.category ? <p className={errorClassName} role="alert">{errors.category.message}</p> : null}
          </div>
        </div>

        <div>
          <label className={labelClassName} htmlFor="subject">Subject <span aria-hidden="true">*</span></label>
          <input {...register("subject")} className={inputClassName} id="subject" maxLength={150} aria-invalid={Boolean(errors.subject)} />
          {errors.subject ? <p className={errorClassName} role="alert">{errors.subject.message}</p> : null}
        </div>

        <div>
          <label className={labelClassName} htmlFor="description">Issue description <span aria-hidden="true">*</span></label>
          <textarea {...register("description")} className={`${inputClassName} min-h-40 resize-y`} id="description" maxLength={4000} aria-invalid={Boolean(errors.description)} />
          {errors.description ? <p className={errorClassName} role="alert">{errors.description.message}</p> : <p className="mt-2 text-xs leading-5 text-navy-600">Maximum 4,000 characters.</p>}
        </div>

        <div>
          <label className={labelClassName} htmlFor="officialServiceRequestReference">Official service-request reference <span className="font-normal text-navy-600">(optional)</span></label>
          <input {...register("officialServiceRequestReference")} className={inputClassName} id="officialServiceRequestReference" maxLength={100} aria-invalid={Boolean(errors.officialServiceRequestReference)} />
          {errors.officialServiceRequestReference ? <p className={errorClassName} role="alert">{errors.officialServiceRequestReference.message}</p> : null}
        </div>

        <div className="absolute left-[-10000px] top-auto size-px overflow-hidden" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input {...register("website")} autoComplete="off" id="website" tabIndex={-1} />
        </div>

        <label className="flex items-start gap-3 rounded-2xl border border-navy-900/10 bg-white p-5 text-sm leading-6 text-navy-800">
          <input {...register("consent")} className="mt-1 size-4 shrink-0 accent-blue-700" type="checkbox" aria-invalid={Boolean(errors.consent)} />
          <span>I understand this is an independently operated platform, not the official City website; submitting does not create a City work order; and the information will be used to review and respond to my request.</span>
        </label>
        {errors.consent ? <p className={errorClassName} role="alert">{errors.consent.message}</p> : null}

        {enabled ? (
          <div>
            <TurnstileWidget onTokenChange={handleTurnstileToken} resetKey={turnstileResetKey} siteKey={siteKey} />
            {errors.turnstileToken ? <p className={errorClassName} role="alert">{errors.turnstileToken.message}</p> : null}
          </div>
        ) : null}

        {formMessage ? <p className="rounded-2xl border border-red-700/20 bg-red-50 p-4 text-sm font-semibold text-red-900" role="alert">{formMessage}</p> : null}

        <Button className="h-12 bg-blue-700 px-6 text-white hover:bg-blue-800" disabled={!enabled || isSubmitting} size="lg" type="submit">
          {isSubmitting ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : null}
          {isSubmitting ? "Submitting…" : enabled ? "Submit request" : "Setup required before submissions"}
        </Button>
      </fieldset>
    </form>
  );
}
