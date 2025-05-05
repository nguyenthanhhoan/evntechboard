/**
 =========================================================
 * EVNHCMC Smart Grid - v4.0.0
 =========================================================

 * Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
 * Copyright 2022 Creative Tim (https://www.creative-tim.com)

 Coded by www.creative-tim.com

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */

// @mui material components
import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

// EVNHCMC Smart Grid components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// EVNHCMC Smart Grid examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";

// React hooks
import { useState } from "react";

function SGI() {
    // Define the table data structure
    const sgiTableData = {
        columns: [
            { name: "STT", align: "center" },
            { name: "Chỉ Số", align: "left" },
            { name: "Tiêu Chí Đánh Giá", align: "left" },
            { name: "Điểm", align: "center" },
        ],
        rows: [
            // 1. Giám sát & Điều khiển
            { STT: "1", "Chỉ Số": "Giám sát & Điều khiển", "Tiêu Chí Đánh Giá": "", "Điểm": "" },
            { STT: "1.1", "Chỉ Số": "Hệ thống SCADA trong lưới điện phân phối", "Tiêu Chí Đánh Giá": "Không có", "Điểm": 0 },
            { STT: "", "Chỉ Số": "", "Tiêu Chí Đánh Giá": "Có SCADA cơ bản", "Điểm": 2 },
            { STT: "", "Chỉ Số": "", "Tiêu Chí Đánh Giá": "SCADA tích hợp DMS (giám sát và điều khiển điện áp)", "Điểm": 3 },
            { STT: "", "Chỉ Số": "", "Tiêu Chí Đánh Giá": "SCADA tích hợp ADMS (OMS, FLISR, tối ưu hóa vận hành)", "Điểm": 4 },
            { STT: "1.2", "Chỉ Số": "Tích hợp hệ thống DMS/ADMS", "Tiêu Chí Đánh Giá": "Không có hệ thống DMS/ADMS", "Điểm": 0 },
            { STT: "", "Chỉ Số": "", "Tiêu Chí Đánh Giá": "DMS cơ bản", "Điểm": 2 },
            { STT: "", "Chỉ Số": "", "Tiêu Chí Đánh Giá": "DMS tích hợp FLISR & OMS", "Điểm": 3 },
            { STT: "", "Chỉ Số": "", "Tiêu Chí Đánh Giá": "ADMS với đầy đủ chức năng tự động hóa", "Điểm": 4 },

            // 2. Phân tích Dữ liệu & Ứng dụng AI
            { STT: "2", "Chỉ Số": "Phân tích Dữ liệu & Ứng dụng AI", "Tiêu Chí Đánh Giá": "", "Điểm": "" },
            { STT: "2.1", "Chỉ Số": "Tỷ lệ khách hàng sử dụng công tơ thông minh", "Tiêu Chí Đánh Giá": "Không triển khai", "Điểm": 0 },
            { STT: "", "Chỉ Số": "", "Tiêu Chí Đánh Giá": "≤ 75%", "Điểm": 1 },
            { STT: "", "Chỉ Số": "", "Tiêu Chí Đánh Giá": "75-85%", "Điểm": 2 },
            { STT: "", "Chỉ Số": "", "Tiêu Chí Đánh Giá": "85-95%", "Điểm": 3 },
            { STT: "", "Chỉ Số": "", "Tiêu Chí Đánh Giá": "95-100%", "Điểm": 4 },
            { STT: "2.2", "Chỉ Số": "Ứng dụng phân tích dữ liệu & AI trong quản lý lưới điện", "Tiêu Chí Đánh Giá": "Không sử dụng", "Điểm": 0 },
            { STT: "", "Chỉ Số": "", "Tiêu Chí Đánh Giá": "Có một số phân tích cơ bản", "Điểm": 2 },
            { STT: "", "Chỉ Số": "", "Tiêu Chí Đánh Giá": "Sử dụng AI/Digital Twin cho một số ứng dụng", "Điểm": 3 },
            { STT: "", "Chỉ Số": "", "Tiêu Chí Đánh Giá": "AI/Digital Twin tích hợp vào nhiều khía cạnh", "Điểm": 4 },

            // 3. Độ Tin Cậy Cung Cấp
            { STT: "3", "Chỉ Số": "Độ Tin Cậy Cung Cấp", "Tiêu Chí Đánh Giá": "", "Điểm": "" },
            { STT: "3.1", "Chỉ Số": "Chỉ số SAIDI (phút)", "Tiêu Chí Đánh Giá": "> 60 phút", "Điểm": 0 },
            { STT: "", "Chỉ Số": "", "Tiêu Chí Đánh Giá": "40-60 phút", "Điểm": 1 },
            { STT: "", "Chỉ Số": "", "Tiêu Chí Đánh Giá": "20-40 phút", "Điểm": 2 },
            { STT: "", "Chỉ Số": "", "Tiêu Chí Đánh Giá": "10-20 phút", "Điểm": 3 },
            { STT: "", "Chỉ Số": "", "Tiêu Chí Đánh Giá": "≤ 10 phút", "Điểm": 4 },
            { STT: "3.2", "Chỉ Số": "Chỉ số SAIFI (lần)", "Tiêu Chí Đánh Giá": "> 1 lần", "Điểm": 0 },
            { STT: "", "Chỉ Số": "", "Tiêu Chí Đánh Giá": "0.5 - 1 lần", "Điểm": 1 },
            { STT: "", "Chỉ Số": "", "Tiêu Chí Đánh Giá": "0.25 - 0.5 lần", "Điểm": 2 },
            { STT: "", "Chỉ Số": "", "Tiêu Chí Đánh Giá": "0.15 - 0.25 lần", "Điểm": 3 },
            { STT: "", "Chỉ Số": "", "Tiêu Chí Đánh Giá": "≤ 0.15 lần", "Điểm": 4 },

            // 4. Tích hợp nguồn Năng lượng Phân tán (DER)
            { STT: "4", "Chỉ Số": "Tích hợp nguồn Năng lượng Phân tán (DER)", "Tiêu Chí Đánh Giá": "", "Điểm": "" },
            { STT: "4.1", "Chỉ Số": "Quản lý kết nối DER", "Tiêu Chí Đánh Giá": "Không có hướng dẫn đấu nối DER", "Điểm": 0 },
            { STT: "", "Chỉ Số": "", "Tiêu Chí Đánh Giá": "Có quy trình đấu nối nhưng không công khai", "Điểm": 1 },
            { STT: "", "Chỉ Số": "", "Tiêu Chí Đánh Giá": "Quy trình công khai trên website & có bản đồ GIS", "Điểm": 2 },
            { STT: "", "Chỉ Số": "", "Tiêu Chí Đánh Giá": "Hệ thống quản lý DER giới hạn", "Điểm": 3 },
            { STT: "", "Chỉ Số": "", "Tiêu Chí Đánh Giá": "Có hệ thống DERMS quản lý nguồn NLTT phân tán", "Điểm": 4 },
            { STT: "4.2", "Chỉ Số": "Dung lượng hệ thống lưu trữ năng lượng (ESS) trên lưới", "Tiêu Chí Đánh Giá": "Không có ESS", "Điểm": 0 },
            { STT: "", "Chỉ Số": "", "Tiêu Chí Đánh Giá": "< 1 MWh", "Điểm": 1 },
            { STT: "", "Chỉ Số": "", "Tiêu Chí Đánh Giá": "1-3 MWh", "Điểm": 2 },
            { STT: "", "Chỉ Số": "", "Tiêu Chí Đánh Giá": "3-10 MWh", "Điểm": 3 },
            { STT: "", "Chỉ Số": "", "Tiêu Chí Đánh Giá": "≥ 10 MWh", "Điểm": 3.5 },
            { STT: "", "Chỉ Số": "", "Tiêu Chí Đánh Giá": "ESS tích hợp điều khiển thông minh", "Điểm": 4 },

            // 5. Năng lượng Xanh
            { STT: "5", "Chỉ Số": "Năng lượng Xanh", "Tiêu Chí Đánh Giá": "", "Điểm": "" },
            { STT: "5.1", "Chỉ Số": "Tỷ lệ năng lượng tái tạo", "Tiêu Chí Đánh Giá": "< 5%", "Điểm": 0 },
            { STT: "", "Chỉ Số": "", "Tiêu Chí Đánh Giá": "5-10%", "Điểm": 1 },
            { STT: "", "Chỉ Số": "", "Tiêu Chí Đánh Giá": "10-20%", "Điểm": 2 },
            { STT: "", "Chỉ Số": "", "Tiêu Chí Đánh Giá": "20-30%", "Điểm": 3 },
            { STT: "", "Chỉ Số": "", "Tiêu Chí Đánh Giá": "≥ 30%", "Điểm": 4 },
            { STT: "5.2", "Chỉ Số": "Các sáng kiến xe điện & cơ sở hạ tầng sạc", "Tiêu Chí Đánh Giá": "Không có sáng kiến liên quan đến xe điện (EV)", "Điểm": 0 },
            { STT: "", "Chỉ Số": "", "Tiêu Chí Đánh Giá": "Thí điểm xe điện trong vận hành nội bộ", "Điểm": 1 },
            { STT: "", "Chỉ Số": "", "Tiêu Chí Đánh Giá": "Hỗ trợ TOU (Time-of-Use Pricing)", "Điểm": 2 },
            { STT: "", "Chỉ Số": "", "Tiêu Chí Đánh Giá": "Có trạm sạc EV & hỗ trợ V2G", "Điểm": 3 },
            { STT: "", "Chỉ Số": "", "Tiêu Chí Đánh Giá": "EV tham gia điều chỉnh tần số/điện áp", "Điểm": 4 },

            // 6. An ninh bảo mật
            { STT: "6", "Chỉ Số": "An ninh bảo mật", "Tiêu Chí Đánh Giá": "", "Điểm": "" },
            { STT: "6.1", "Chỉ Số": "Tiêu chuẩn bảo mật IT", "Tiêu Chí Đánh Giá": "Không áp dụng tiêu chuẩn bảo mật IT", "Điểm": 0 },
            { STT: "", "Chỉ Số": "", "Tiêu Chí Đánh Giá": "Áp dụng nhưng chưa có chứng nhận", "Điểm": 2 },
            { STT: "", "Chỉ Số": "", "Tiêu Chí Đánh Giá": "Chứng nhận ISO 27001 hoặc tương đương", "Điểm": 3 },
            { STT: "", "Chỉ Số": "", "Tiêu Chí Đánh Giá": "SIEM, Zero Trust Security hoặc CIS Controls", "Điểm": 4 },
            { STT: "6.2", "Chỉ Số": "Tiêu chuẩn bảo mật OT", "Tiêu Chí Đánh Giá": "Không có tiêu chuẩn bảo mật OT", "Điểm": 0 },
            { STT: "", "Chỉ Số": "", "Tiêu Chí Đánh Giá": "Một số tiêu chuẩn đang được áp dụng", "Điểm": 2 },
            { STT: "", "Chỉ Số": "", "Tiêu Chí Đánh Giá": "Chứng nhận tiêu chuẩn bảo mật OT (NERC CIP, IEC 62443...)", "Điểm": 3 },
            { STT: "", "Chỉ Số": "", "Tiêu Chí Đánh Giá": "Có trung tâm SOC giám sát SCADA/ADMS", "Điểm": 4 },

            // 7. Trao quyền & Sự hài lòng của Khách hàng
            { STT: "7", "Chỉ Số": "Trao quyền & Sự hài lòng của Khách hàng", "Tiêu Chí Đánh Giá": "", "Điểm": "" },
            { STT: "7.1", "Chỉ Số": "Cung cấp thông tin thời gian thực (RTI) & chương trình điều chỉnh phụ tải (DR)", "Tiêu Chí Đánh Giá": "Không cung cấp RTI hoặc chương trình DR", "Điểm": 0 },
            { STT: "", "Chỉ Số": "", "Tiêu Chí Đánh Giá": "Cung cấp dữ liệu RTI hàng ngày", "Điểm": 2 },
            { STT: "", "Chỉ Số": "", "Tiêu Chí Đánh Giá": "RTI cho khách hàng thương mại (30 phút) & dân cư (hàng ngày)", "Điểm": 3 },
            { STT: "", "Chỉ Số": "", "Tiêu Chí Đánh Giá": "RTI theo thời gian thực & DR linh hoạt", "Điểm": 4 },
            { STT: "7.2", "Chỉ Số": "Khảo sát mức độ hài lòng của khách hàng", "Tiêu Chí Đánh Giá": "< 80%", "Điểm": 1 },
            { STT: "", "Chỉ Số": "", "Tiêu Chí Đánh Giá": "80-85%", "Điểm": 2 },
            { STT: "", "Chỉ Số": "", "Tiêu Chí Đánh Giá": "85-95%", "Điểm": 3 },
            { STT: "", "Chỉ Số": "", "Tiêu Chí Đánh Giá": "≥ 95% (khảo sát định kỳ, mức độ tin cậy cao)", "Điểm": 4 },
        ],
    };

    // State to manage user-selected scores
    const [scores, setScores] = useState({});

    // Handle score change
    const handleScoreChange = (index, value) => {
        setScores((prevScores) => ({
            ...prevScores,
            [index]: value,
        }));
    };

    // Map rows with dropdowns for score input
    const rowsWithInput = sgiTableData.rows.map((row, index) => ({
        STT: row.STT,
        "Chỉ Số": row["Chỉ Số"],
        "Tiêu Chí Đánh Giá": row["Tiêu Chí Đánh Giá"],
        "Điểm": (
            <Select
                value={scores[index] !== undefined ? scores[index] : ""}
                onChange={(e) => handleScoreChange(index, e.target.value)}
                displayEmpty
                sx={{ height: "36px", minWidth: "80px" }}
                disabled={row["Chỉ Số"] !== "" && row.STT.includes(".")} // Enable only for subcategories
            >
                <MenuItem value="" disabled>Select Score</MenuItem>
                {[0, 1, 2, 3, 3.5, 4].includes(row["Điểm"]) && <MenuItem value={0}>0</MenuItem>}
                {[1, 2, 3, 3.5, 4].includes(row["Điểm"]) && <MenuItem value={1}>1</MenuItem>}
                {[2, 3, 4].includes(row["Điểm"]) && <MenuItem value={2}>2</MenuItem>}
                {[3, 3.5, 4].includes(row["Điểm"]) && <MenuItem value={3}>3</MenuItem>}
                {row["Điểm"] === 3.5 && <MenuItem value={3.5}>3.5</MenuItem>}
                {[4].includes(row["Điểm"]) && <MenuItem value={4}>4</MenuItem>}
            </Select>
        ),
    }));

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <SoftBox py={3}>
                <Card>
                    <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
                        <SoftTypography variant="h6">SGI Evaluation Table</SoftTypography>
                    </SoftBox>
                    <SoftBox
                        sx={{
                            "& .MuiTableRow-root:not(:last-child)": {
                                "& td": {
                                    borderBottom: ({ borders: { borderWidth, borderColor } }) =>
                                        `${borderWidth[1]} solid ${borderColor}`,
                                },
                            },
                        }}
                    >
                        <Table columns={sgiTableData.columns} rows={rowsWithInput} />
                    </SoftBox>
                </Card>
            </SoftBox>
            <Footer />
        </DashboardLayout>
    );
}

export default SGI;