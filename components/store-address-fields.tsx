"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";

type AddressParts = {
  address: string;
  city: string;
  state: string;
  country: string;
};

type GoogleAddressComponent = {
  long_name: string;
  types: string[];
};

type GooglePlace = {
  formatted_address?: string;
  address_components?: GoogleAddressComponent[];
};

type GoogleMapsWindow = Window & {
  google?: {
    maps?: {
      places?: {
        Autocomplete: new (
          input: HTMLInputElement,
          options: { fields: string[]; types: string[]; componentRestrictions?: { country: string[] } }
        ) => {
          addListener: (event: "place_changed", callback: () => void) => void;
          getPlace: () => GooglePlace;
        };
      };
    };
  };
};

const googlePlacesScriptId = "google-places-script";

function getPart(components: GoogleAddressComponent[] | undefined, type: string) {
  return components?.find((component) => component.types.includes(type))?.long_name ?? "";
}

export function StoreAddressFields({ stepIndex }: { stepIndex: number }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [parts, setParts] = useState<AddressParts>({ address: "", city: "", state: "", country: "Nigeria" });
  const googleKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!googleKey || !inputRef.current) {
      return;
    }

    const attachAutocomplete = () => {
      const google = (window as GoogleMapsWindow).google;
      const Autocomplete = google?.maps?.places?.Autocomplete;

      if (!Autocomplete || !inputRef.current) {
        return;
      }

      const autocomplete = new Autocomplete(inputRef.current, {
        fields: ["formatted_address", "address_components"],
        types: ["address"],
        componentRestrictions: { country: ["ng"] }
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        const components = place.address_components;
        setParts({
          address: place.formatted_address ?? inputRef.current?.value ?? "",
          city: getPart(components, "locality") || getPart(components, "administrative_area_level_2"),
          state: getPart(components, "administrative_area_level_1"),
          country: getPart(components, "country") || "Nigeria"
        });
      });
    };

    if (document.getElementById(googlePlacesScriptId)) {
      attachAutocomplete();
      return;
    }

    const script = document.createElement("script");
    script.id = googlePlacesScriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleKey}&libraries=places`;
    script.async = true;
    script.onload = attachAutocomplete;
    document.head.appendChild(script);
  }, [googleKey]);

  return (
    <div className="grid gap-4 md:col-span-2 md:grid-cols-2">
      <label className="grid gap-2 text-sm font-extrabold text-[#1F1F1F] md:col-span-2">
        Store Address
        <span className="flex items-center gap-3 rounded-2xl border border-[#ece6ff] bg-white px-4 py-3">
          <MapPin size={18} className="text-[#6C3CF0]" />
          <input
            ref={inputRef}
            name="address"
            value={parts.address}
            onChange={(event) => setParts((value) => ({ ...value, address: event.target.value }))}
            placeholder={googleKey ? "Start typing your store address" : "Street address"}
            data-step={stepIndex}
            data-required="true"
            className="w-full bg-transparent font-semibold outline-none"
          />
        </span>
        <span className="text-xs font-bold leading-5 text-[#6B7280]">
          {googleKey ? "Google address autocomplete is enabled." : "Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable Google address autocomplete."}
        </span>
      </label>
      <AddressInput stepIndex={stepIndex} name="city" label="City" value={parts.city} onChange={(city) => setParts((value) => ({ ...value, city }))} />
      <AddressInput stepIndex={stepIndex} name="state" label="State" value={parts.state} onChange={(state) => setParts((value) => ({ ...value, state }))} />
      <AddressInput stepIndex={stepIndex} name="country" label="Country" value={parts.country} onChange={(country) => setParts((value) => ({ ...value, country }))} />
    </div>
  );
}

function AddressInput({ label, name, value, stepIndex, onChange }: { label: string; name: string; value: string; stepIndex: number; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2 text-sm font-extrabold text-[#1F1F1F]">
      {label}
      <input
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={label}
        data-step={stepIndex}
        data-required="true"
        className="rounded-2xl border border-[#ece6ff] bg-white px-4 py-3 font-semibold outline-none focus:border-[#6C3CF0]"
      />
    </label>
  );
}
