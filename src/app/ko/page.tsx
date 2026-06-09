import type { Metadata } from "next";
import Home from "../page";

export const metadata: Metadata = {
  title: "GOODMAN GLS — 한국 통합 물류 파트너 | 항공·해상·육상·통관·창고",
  description:
    "GOODMAN GLS는 한국 기반 통합 물류 기업으로 항공·해상·육상 운송, 통관, 창고/3PL, 프로젝트 카고를 제공합니다. ECS Group의 59개국 네트워크와 함께 글로벌 물류 실행력을 제공합니다.",
  alternates: {
    canonical: "/ko",
    languages: {
      en: "/",
      ko: "/ko",
      "x-default": "/",
    },
  },
  openGraph: {
    title: "GOODMAN GLS — 한국 통합 물류 파트너",
    description:
      "한국 기반 통합 물류 기업 GOODMAN GLS — 항공·해상·육상 운송, 통관, 창고/3PL, 프로젝트 카고.",
    url: "https://goodmangls.com/ko",
    siteName: "GOODMAN GLS",
    locale: "ko_KR",
    type: "website",
  },
};

export default Home;
