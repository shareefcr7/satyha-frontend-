import { SocialNetworks } from "./footer.types";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import LayoutSpacing from "./LayoutSpacing";

const socialsData: SocialNetworks[] = [
  {
    id: 1,
    icon: <FaFacebookF />,
    url: "https://www.facebook.com/share/r/1BCciXuxQ8/",
  },
  {
    id: 2,
    icon: <FaInstagram />,
    url: "https://www.instagram.com/clearglass.in/",
  },
  {
    id: 3,
    icon: <FaWhatsapp />,
    url: "https://wa.me/919074136802",
  },
];

const Footer = () => {
  return (
    <footer className="mt-10 border-t border-gray-100">
      <div className="pt-8 md:pt-[50px] bg-white px-4 pb-4">
        <div className="max-w-frame mx-auto">
          <nav className="lg:grid lg:grid-cols-12 mb-8">
            <div className="flex flex-col lg:col-span-3 lg:max-w-[248px]">
              <Link href="/" className="mb-6 inline-block">
                <Image
                  src="/icon-192x192.png"
                  alt="CG Logo"
                  width={72}
                  height={72}
                  className="object-contain"
                  priority
                />
              </Link>
              <p className="text-black/60 text-sm mb-4">
                Premium car wash products and accessories. Quality you can trust for every vehicle.
              </p>
              <p className="text-black/60 text-sm font-medium mb-9">
                <a href="mailto:info@clearglass.in" className="hover:text-brand transition-colors">
                  info@clearglass.in
                </a>
              </p>
              <div className="flex items-center">
                {socialsData.map((social) => (
                  <Link
                    href={social.url}
                    key={social.id}
                    className="bg-gray-100 hover:bg-brand hover:text-white text-black/60 transition-all mr-3 w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center p-2"
                  >
                    {social.icon}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
          <hr className="border-gray-100 mb-6" />
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-black/40 text-xs md:text-sm font-medium">
              © 2024-2026. All Rights Reserved.
            </p>
            <p className="text-black/30 font-bold text-[10px] md:text-xs uppercase tracking-[0.4em]">
              Clean. Shine. Drive.
            </p>
          </div>
        </div>
        <LayoutSpacing />
      </div>
    </footer>
  );
};

export default Footer;
