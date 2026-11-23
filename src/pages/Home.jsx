import Navbar from "@/components/layouts/Navbar";
import Hero from "@/components/features/Hero/Hero";
import Statement from "@/components/features/Statement/Statement";
import OurStory from "@/components/features/Story/OurStory";
import Work from "@/components/features/Work/Work";
import Contact from "@/components/features/Contact/Contact";

/**
 * صفحه اصلی استودیو راک (Home Page Orchestrator).
 * 
 * چیدمان زنجیره‌ای سکشن‌های اصلی بدون حاشیه یا پرش:
 * ۱. Navbar: نوار ناوبری شیشه‌ای چسبان با پدیدار شدن بر مبنای اسکرول
 * ۲. Hero: خوش‌آمدگویی سه‌بعدی و حل شدن حروف Rok Studio
 * ۳. Statement: بیانیه مانیفست استودیو و دلیوربل‌های اصلی
 * ۴. OurStory: عکس سینمایی و اسپات‌لایت تعاملی ۳ هم‌بنیان‌گذار استودیو
 * ۵. Work: دیوار شناور سه‌بعدی پروژه‌ها (DriftWall)
 * ۶. Contact: کیبورد مکانیکی تعاملی ۷۵٪ مک و فرم ثبت پیام
 */
export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Statement />
      <OurStory />
      <Work />
      <Contact />
    </>
  );
}
