"use client";

import React from "react";

type AddressData = {
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
};

type Props = {
  address: AddressData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

const AddressForm = ({ address, onChange }: Props) => {
  return (
    <div className="w-full p-5 md:p-8 rounded-[20px] border border-brand/10 bg-white shadow-sm mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h3 className="text-xl md:text-2xl font-bold text-brand mb-6 flex items-center gap-2">
        <span className="bg-brand text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
        Delivery Address
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="text-[10px] md:text-xs font-bold text-brand/60 uppercase tracking-wider ml-1">Full Name</label>
          <input 
            name="name" 
            value={address.name} 
            onChange={onChange}
            placeholder="John Doe" 
            className="w-full bg-[#fdf5e6] border-none rounded-xl px-4 py-3.5 text-sm md:text-base focus:ring-2 focus:ring-brand outline-none transition-all placeholder:text-brand/20"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] md:text-xs font-bold text-brand/60 uppercase tracking-wider ml-1">Phone Number</label>
          <input 
            name="phone" 
            value={address.phone} 
            onChange={onChange}
            placeholder="+91 00000 00000" 
            className="w-full bg-[#fdf5e6] border-none rounded-xl px-4 py-3.5 text-sm md:text-base focus:ring-2 focus:ring-brand outline-none transition-all placeholder:text-brand/20"
          />
        </div>
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-[10px] md:text-xs font-bold text-brand/60 uppercase tracking-wider ml-1">Shipping Address</label>
          <textarea 
            name="address" 
            value={address.address} 
            onChange={onChange}
            placeholder="House No, Street, Locality" 
            rows={3}
            className="w-full bg-[#fdf5e6] border-none rounded-xl px-4 py-3.5 text-sm md:text-base focus:ring-2 focus:ring-brand outline-none transition-all resize-none placeholder:text-brand/20"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] md:text-xs font-bold text-brand/60 uppercase tracking-wider ml-1">City</label>
          <input 
            name="city" 
            value={address.city} 
            onChange={onChange}
            placeholder="Kochi" 
            className="w-full bg-[#fdf5e6] border-none rounded-xl px-4 py-3.5 text-sm md:text-base focus:ring-2 focus:ring-brand outline-none transition-all placeholder:text-brand/20"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] md:text-xs font-bold text-brand/60 uppercase tracking-wider ml-1">Pincode</label>
          <input 
            name="pincode" 
            value={address.pincode} 
            onChange={onChange}
            placeholder="682001" 
            className="w-full bg-[#fdf5e6] border-none rounded-xl px-4 py-3.5 text-sm md:text-base focus:ring-2 focus:ring-brand outline-none transition-all placeholder:text-brand/20"
          />
        </div>
      </div>
    </div>
  );
};

export default AddressForm;
