export interface AdvisorInfo {
  name: string;
  phone: string;
  phoneRaw: string;
  role?: string;
}

export interface FaqStep {
  step: number;
  title: string;
  desc: string;
  image: string;
}

export interface FaqTopic {
  id: string;
  title: string;
  shortDesc: string;
  videoUrl: string;
  videoYoutubeId?: string;
  steps: FaqStep[];
}

export interface ProductItem {
  id: string;
  category: string;
  title: string;
  image: string;
  desc: string;
  badge: string;
}

export interface BranchLocation {
  id: string;
  branch: string;
  name: string;
  address: string;
  image: string;
  imageFallback: string;
  mapUrl: string;
  phone: string;
}

export interface LoanScheduleRow {
  period: number;
  date: string;
  startingBalance: number;
  principal: number;
  interest: number;
  totalPayment: number;
  endingBalance: number;
}
