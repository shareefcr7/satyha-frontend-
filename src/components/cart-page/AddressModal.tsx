"use client";

import React from "react";
import { FaTimes } from "react-icons/fa";

type AddressData = {
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  address: AddressData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSave: () => void;
};

const AddressModal = ({ isOpen, onClose, address, onChange, onSave }: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="bg-white w-full max-w-[500px] rounded-[30px] p-6 md:p-8 shadow-2xl relative animate-in zoom-in-95 slide-in-from-bottom-10 duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-brand/40 hover:text-brand transition-colors"
        >
          <FaTimes size={20} />
        </button>

        <h3 className="text-2xl md:text-3xl font-bold text-brand mb-8 flex items-center gap-3">
          Delivery Address
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-brand/60 uppercase tracking-widest ml-1">Full Name</label>
            <input 
              name="name" 
              value={address.name} 
              onChange={onChange}
              placeholder="John Doe" 
              className="w-full bg-[#fdf5e6] border-none rounded-2xl px-4 py-4 text-sm focus:ring-2 focus:ring-brand outline-none transition-all placeholder:text-brand/20"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-brand/60 uppercase tracking-widest ml-1">Phone Number</label>
            <input 
              name="phone" 
              value={address.phone} 
              onChange={onChange}
              type="tel"
              maxLength={15}
              placeholder="+91 00000 00000" 
              className={`w-full bg-[#fdf5e6] border-none rounded-2xl px-4 py-4 pr-10 text-sm focus:ring-2 outline-none transition-all placeholder:text-brand/20 ${
                address.phone && !/^(?:\+91|0)?[6-9]\d{9}$/.test(address.phone.replace(/\s+/g, "")) 
                ? "ring-2 ring-red-400" 
                : "focus:ring-brand"
              }`}
            />
            {address.phone && !/^(?:\+91|0)?[6-9]\d{9}$/.test(address.phone.replace(/\s+/g, "")) && (
              <p className="text-[10px] text-red-500 ml-2 font-medium">Please enter a valid Indian number</p>
            )}
          </div>
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-[10px] font-bold text-brand/60 uppercase tracking-widest ml-1">Shipping Address</label>
            <textarea 
              name="address" 
              value={address.address} 
              onChange={onChange}
              placeholder="House No, Street, Locality" 
              rows={3}
              className="w-full bg-[#fdf5e6] border-none rounded-2xl px-4 py-4 text-sm focus:ring-2 focus:ring-brand outline-none transition-all resize-none placeholder:text-brand/20"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-brand/60 uppercase tracking-widest ml-1">City</label>
            <input 
              name="city" 
              value={address.city} 
              onChange={onChange}
              placeholder="Kochi" 
              className="w-full bg-[#fdf5e6] border-none rounded-2xl px-4 py-4 text-sm focus:ring-2 focus:ring-brand outline-none transition-all placeholder:text-brand/20"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-brand/60 uppercase tracking-widest ml-1">Pincode</label>
            <input 
              name="pincode" 
              value={address.pincode} 
              onChange={onChange}
              placeholder="682001" 
              className="w-full bg-[#fdf5e6] border-none rounded-2xl px-4 py-4 text-sm focus:ring-2 focus:ring-brand outline-none transition-all placeholder:text-brand/20"
            />
          </div>
        </div>

        <button 
          onClick={onSave}
          className="w-full bg-brand text-white font-bold py-4 rounded-2xl mt-8 hover:bg-brand-dark transition-all active:scale-[0.98] shadow-lg shadow-brand/20"
        >
          Confirm Address
        </button>
      </div>
    </div>
  );
};

export default AddressModal;
