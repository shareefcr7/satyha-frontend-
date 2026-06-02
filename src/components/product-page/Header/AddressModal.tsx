"use client";

import React, { useState } from "react";
import { Product } from "@/types/product.types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  productData: Product & { quantity: number };
  attributes: string[];
};

const AddressModal = ({ isOpen, onClose, productData, attributes }: Props) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBuyNow = () => {
    const { name, phone, address, city, pincode } = formData;
    if (!name || !phone || !address || !city || !pincode) {
      alert("Please fill all address details");
      return;
    }

    const WHATSAPP_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "919074136802"; // Default if not set
    const price = productData.price || productData.sellingPrice || 0;
    
    let messageText = `Hi Clear Glass! I'd like to buy this product:\n\n`;
    messageText += `🛍️ *Product:* ${productData.title || productData.name || "Product"}\n`;
    messageText += `🔢 *Quantity:* ${productData.quantity}\n`;
    messageText += `💰 *Price:* ₹${Math.round(price * productData.quantity)}\n\n`;
    
    messageText += `📍 *Delivery Address:*\n`;
    messageText += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    messageText += `👤 *Name:* ${name}\n`;
    messageText += `📞 *Phone:* ${phone}\n`;
    messageText += `🏠 *Address:* ${address}\n`;
    messageText += `🏙️ *City:* ${city}\n`;
    messageText += `📌 *Pincode:* ${pincode}\n`;
    messageText += `━━━━━━━━━━━━━━━━━━━━━━\n`;

    const message = encodeURIComponent(messageText);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${message}`;
    window.location.href = whatsappUrl;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-brand">Delivery Address</h2>
            <button onClick={onClose} className="text-brand/40 hover:text-brand text-2xl">&times;</button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-brand/60 mb-1 uppercase">Full Name</label>
              <input 
                name="name" 
                value={formData.name} 
                onChange={handleChange}
                placeholder="John Doe" 
                className="w-full bg-[#fdf5e6] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand/60 mb-1 uppercase">Phone Number</label>
              <input 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange}
                placeholder="+91 00000 00000" 
                className="w-full bg-[#fdf5e6] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand/60 mb-1 uppercase">Shipping Address</label>
              <textarea 
                name="address" 
                value={formData.address} 
                onChange={handleChange}
                placeholder="House No, Street, Locality" 
                rows={3}
                className="w-full bg-[#fdf5e6] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand outline-none transition-all resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-brand/60 mb-1 uppercase">City</label>
                <input 
                  name="city" 
                  value={formData.city} 
                  onChange={handleChange}
                  placeholder="Kochi" 
                  className="w-full bg-[#fdf5e6] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-brand/60 mb-1 uppercase">Pincode</label>
                <input 
                  name="pincode" 
                  value={formData.pincode} 
                  onChange={handleChange}
                  placeholder="682001" 
                  className="w-full bg-[#fdf5e6] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand outline-none transition-all"
                />
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleBuyNow}
            className="w-full bg-[#25D366] text-white font-bold py-4 rounded-xl mt-8 flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.765-5.764-5.765zm3.394 8.163c-.147.415-.852.767-1.201.815-.349.048-.78.073-1.288-.088-.31-.099-.68-.242-1.127-.439-1.914-.846-3.153-2.844-3.248-2.977-.094-.132-.776-1.031-.776-1.966 0-.935.49-.1.68-.182.19-.082.415-.104.536-.104s.241.002.346.006c.115.005.27.022.412.357.147.348.504 1.234.548 1.323.044.089.073.192.015.309-.058.117-.088.192-.175.29-.087.098-.183.219-.261.296-.089.09-.181.186-.078.36.103.174.457.753.981 1.218.673.597 1.24.783 1.414.87.174.087.276.073.379-.044.103-.117.441-.513.559-.688.117-.175.235-.147.396-.088.161.059 1.023.481 1.2.569.177.088.295.133.338.207.045.074.045.428-.102.843z"/>
              <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595-.593-.942c-.794-1.261-1.213-2.72-1.212-4.225.002-4.577 3.735-8.303 8.311-8.303 2.221 0 4.31.866 5.88 2.438 1.571 1.573 2.435 3.664 2.433 5.888-.003 4.578-3.737 8.304-8.312 8.304z"/>
            </svg>
            ORDER ON WHATSAPP
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
