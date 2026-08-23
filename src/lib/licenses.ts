import { LicenseType } from "@prisma/client";
import { LicenseInfo } from "@/types";

export const LICENSE_LABELS: Record<LicenseType, LicenseInfo> = {
  personal: {
    code: "PERSONAL",
    label: "Cá nhân",
    description: "1 người dùng, phục vụ dự án cá nhân phi thương mại.",
  },
  team: {
    code: "TEAM",
    label: "Đội nhóm",
    description: "Tối đa 5 thành viên trong cùng một tổ chức/công ty.",
  },
  commercial: {
    code: "COMMERCIAL",
    label: "Thương mại",
    description: "Dùng cho dự án sinh lợi nhuận, không giới hạn người dùng cuối.",
  },
  extended: {
    code: "EXTENDED",
    label: "Mở rộng",
    description: "Bao gồm quyền thương mại + quyền nhúng/phân phối lại trong sản phẩm phái sinh.",
  },
};
