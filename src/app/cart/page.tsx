"use client";

import BreadcrumbCart from "@/components/cart-page/BreadcrumbCart";
import ProductCard from "@/components/cart-page/ProductCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import { FaArrowRight } from "react-icons/fa6";
import { TbBasketExclamation } from "react-icons/tb";
import React, { useState } from "react";
import { RootState } from "@/lib/store";
import { useAppSelector } from "@/lib/hooks/redux";
import Link from "next/link";
import AddressModal from "@/components/cart-page/AddressModal";

// WhatsApp configuration
const WHATSAPP_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "919074136802";
const WHATSAPP_MESSAGE = "Hi Clear Glass! I'd like to place an order.";

export default function CartPage() {
  const { cart, totalPrice, adjustedTotalPrice } = useAppSelector(
    (state: RootState) => state.carts
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleCheckout = () => {
    try {
      if (!cart || !cart.items || cart.items.length === 0) {
        alert("Your cart is empty!");
        return;
      }

      if (!address.name || !address.phone || !address.address || !address.city || !address.pincode) {
        setIsModalOpen(true);
        return;
      }

      // Indian Phone Number Validation (10 digits, optional +91 or 0)
      const phoneRegex = /^(?:\+91|0)?[6-9]\d{9}$/;
      if (!phoneRegex.test(address.phone.replace(/\s+/g, ""))) {
        alert("Please enter a valid 10-digit Indian phone number!");
        setIsModalOpen(true);
        return;
      }

      let messageText = `${WHATSAPP_MESSAGE}\n\n`;
      
      messageText += `📦 *Order Details:*\n`;
      messageText += `━━━━━━━━━━━━━━━━━━━━━━\n`;
      
      cart.items.forEach((item, index) => {
        messageText += `\n${index + 1}. *${item.name}*\n`;
        messageText += `   • Quantity: ${item.quantity}\n`;
        messageText += `   • Details: ${item.attributes.join(", ") || "N/A"}\n`;
        messageText += `   • Price: ₹${Math.round(item.price * item.quantity)}\n`;
      });
      
      messageText += `\n━━━━━━━━━━━━━━━━━━━━━━\n`;
      messageText += `💰 *Order Total:* ₹${Math.round(adjustedTotalPrice)}\n\n`;

      messageText += `📍 *Delivery Address:*\n`;
      messageText += `━━━━━━━━━━━━━━━━━━━━━━\n`;
      messageText += `👤 *Name:* ${address.name}\n`;
      messageText += `📞 *Phone:* ${address.phone}\n`;
      messageText += `🏠 *Address:* ${address.address}\n`;
      messageText += `🏙️ *City:* ${address.city}\n`;
      messageText += `📌 *Pincode:* ${address.pincode}\n`;
      messageText += `━━━━━━━━━━━━━━━━━━━━━━\n`;
      
      const message = encodeURIComponent(messageText);
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${message}`;
      window.location.href = whatsappUrl;
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Error processing checkout. Please try again.");
    }
  };

  const isAddressFilled = address.name && address.phone && address.address && address.city && address.pincode;

  return (
    <main className="pb-20">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        {cart && cart.items.length > 0 ? (
          <>
            <BreadcrumbCart />
            <h2
              className={cn([
                integralCF.className,
                "font-bold text-[32px] md:text-[40px] text-brand uppercase mb-5 md:mb-6",
              ])}
            >
              your cart
            </h2>
            <div className="flex flex-col lg:flex-row space-y-5 lg:space-y-0 lg:space-x-5 items-start">
              <div className="w-full flex flex-col space-y-6">
                <div className="p-3.5 md:px-6 flex-col space-y-4 md:space-y-6 rounded-[20px] border border-brand/10 bg-white">
                  {cart?.items.map((product, idx, arr) => (
                    <React.Fragment key={idx}>
                      <ProductCard data={product} />
                      {arr.length - 1 !== idx && (
                        <hr className="border-t-brand/10" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="w-full lg:max-w-[505px] flex flex-col space-y-6 sticky top-24">
                <div className="p-5 md:px-6 flex flex-col space-y-4 md:space-y-6 rounded-[20px] border border-brand/10 bg-white">
                <h6 className="text-xl md:text-2xl font-bold text-brand">
                  Order Summary
                </h6>
                <div className="flex flex-col space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="md:text-xl text-brand/60">Subtotal</span>
                    <span className="md:text-xl font-bold">₹{totalPrice}</span>
                  </div>
                  <hr className="border-t-brand/10" />
                  <div className="flex items-center justify-between">
                    <span className="md:text-xl text-brand">Total</span>
                    <span className="text-xl md:text-2xl font-bold">
                      ₹{Math.round(adjustedTotalPrice)}
                    </span>
                  </div>
                </div>
                <Button
                  type="button"
                  onClick={handleCheckout}
                  className="text-sm md:text-base font-medium bg-brand rounded-full w-full py-4 h-[54px] md:h-[60px] group hover:bg-brand-dark"
                >
                  Order on WhatsApp{" "}
                  <FaArrowRight className="text-xl ml-2 group-hover:translate-x-1 transition-all" />
                </Button>
                
                <p className="text-[10px] text-center text-brand/40 uppercase font-bold tracking-widest">
                  Secure WhatsApp Checkout
                </p>
              </div>
              
              <div className="p-5 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4 rounded-[20px] border border-brand/10 bg-white shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="bg-brand text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-brand mb-0.5">Delivery Address</h3>
                    <p className="text-brand/60 text-xs">
                      {isAddressFilled 
                        ? `${address.name}, ${address.city}` 
                        : "Add your shipping details to complete the order"}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full md:w-auto shrink-0 bg-white text-brand border border-brand/20 font-bold px-6 py-2.5 rounded-full hover:bg-brand hover:text-white transition-all active:scale-[0.98] text-xs"
                >
                  {isAddressFilled ? "Change" : "Add Address"}
                </button>
              </div>
            </div>
            </div>

            <AddressModal 
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              address={address}
              onChange={handleAddressChange}
              onSave={() => setIsModalOpen(false)}
            />
          </>
        ) : (
          <div className="flex items-center flex-col text-gray-300 mt-32">
            <TbBasketExclamation strokeWidth={1} className="text-6xl" />
            <span className="block mb-4">Your shopping cart is empty.</span>
            <Button className="rounded-full w-24" asChild>
              <Link href="/shop">Shop</Link>
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
