const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType,
  ImageRun, PageBreak, VerticalAlign, Footnote, FootnoteReferenceRun,
} = require("docx");

// ---------- Doc du lieu ket qua ----------
const csvText = fs.readFileSync("results/results.csv", "utf-8").trim();
const lines = csvText.split("\n");
const header = lines[0].split(",");
const dataRows = lines.slice(1).map((l) => l.split(","));

function fmt(x) {
  return parseFloat(x).toFixed(2);
}

// ---------- Style dung chung ----------
const FONT = "Calibri";
const TABLE_WIDTH = 9360; // DXA, ~6.5in
const COL_WIDTHS = [1560, 1950, 1950, 1950, 1950]; // Du lieu + 4 thuat toan

function cell(text, opts = {}) {
  return new TableCell({
    width: { size: opts.width || 1950, type: WidthType.DXA },
    verticalAlign: VerticalAlign.CENTER,
    shading: opts.shade
      ? { type: ShadingType.CLEAR, fill: opts.shade }
      : undefined,
    rowSpan: opts.rowSpan,
    columnSpan: opts.columnSpan,
    margins: { top: 80, bottom: 80, left: 100, right: 100 },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: text,
            bold: opts.bold || false,
            font: FONT,
            size: 21,
          }),
        ],
      }),
    ],
  });
}

// ---------- Header bang (2 hang) ----------
const headerRow1 = new TableRow({
  tableHeader: true,
  children: [
    cell("Dữ liệu", { width: COL_WIDTHS[0], bold: true, shade: "D9E2F3", rowSpan: 2 }),
    cell("Thời gian thực hiện (ms)", {
      width: COL_WIDTHS[1] + COL_WIDTHS[2] + COL_WIDTHS[3] + COL_WIDTHS[4],
      bold: true,
      shade: "D9E2F3",
      columnSpan: 4,
    }),
  ],
});

const headerRow2 = new TableRow({
  tableHeader: true,
  children: [
    cell("QuickSort", { width: COL_WIDTHS[1], bold: true, shade: "D9E2F3" }),
    cell("HeapSort", { width: COL_WIDTHS[2], bold: true, shade: "D9E2F3" }),
    cell("MergeSort", { width: COL_WIDTHS[3], bold: true, shade: "D9E2F3" }),
    cell("sort (C++)", { width: COL_WIDTHS[4], bold: true, shade: "D9E2F3" }),
  ],
});

const bodyRows = dataRows.map((row, idx) => {
  const isAvg = row[0].toLowerCase().startsWith("trung");
  const label = isAvg ? "Trung bình" : row[0];
  return new TableRow({
    children: [
      cell(label, { width: COL_WIDTHS[0], bold: isAvg, shade: isAvg ? "F2F2F2" : undefined }),
      cell(fmt(row[1]), { width: COL_WIDTHS[1], bold: isAvg, shade: isAvg ? "F2F2F2" : undefined }),
      cell(fmt(row[2]), { width: COL_WIDTHS[2], bold: isAvg, shade: isAvg ? "F2F2F2" : undefined }),
      cell(fmt(row[3]), { width: COL_WIDTHS[3], bold: isAvg, shade: isAvg ? "F2F2F2" : undefined }),
      cell(fmt(row[4]), { width: COL_WIDTHS[4], bold: isAvg, shade: isAvg ? "F2F2F2" : undefined }),
    ],
  });
});

const resultTable = new Table({
  width: { size: TABLE_WIDTH, type: WidthType.DXA },
  columnWidths: COL_WIDTHS,
  rows: [headerRow1, headerRow2, ...bodyRows],
});

// ---------- Anh bieu do ----------
const chartImage = fs.readFileSync("results/chart.png");

// ---------- Noi dung van ban ----------
const GITHUB_URL = "https://github.com/xuanmailehoang227-alt/sorting-benchmark"; // se duoc thay the sau khi day len GitHub

function heading(text, numbering) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 300, after: 150 },
    children: [
      new TextRun({ text: numbering ? `${numbering}. ${text}` : text, bold: true, font: FONT, size: 26 }),
    ],
  });
}

function subHeading(text) {
  return new Paragraph({
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text, italics: true, bold: true, font: FONT, size: 23 })],
  });
}

function body(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text, font: FONT, size: 22, bold: opts.bold })],
  });
}

const doc = new Document({
  styles: {
    default: {
      document: { run: { font: FONT, size: 22 } },
    },
  },
  sections: [
    {
      properties: {},
      children: [
        // ---- Trang bia ----
        new Paragraph({
          children: [new TextRun({ text: "Lớp: ", font: FONT, size: 24 }), new TextRun({ text: "IT003.R17", bold: true, font: FONT, size: 24 })],
        }),
        new Paragraph({ spacing: { before: 300, after: 150 }, alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "BÁO CÁO KẾT QUẢ THỬ NGHIỆM", bold: true, font: FONT, size: 36 })],
        }),
        new Paragraph({
          children: [new TextRun({ text: "Thời gian thực hiện: 01/10 – 10/10/2026", font: FONT, size: 22 })],
        }),
        new Paragraph({ spacing: { before: 200 },
          children: [new TextRun({ text: "Sinh viên thực hiện: Lê Hoàng Xuân Mai (MSSV: 25521070)", font: FONT, size: 22 })],
        }),
        new Paragraph({ spacing: { before: 300, after: 200 },
          children: [new TextRun({ text: "Nội dung báo cáo:", bold: true, font: FONT, size: 24 })],
        }),

        // ---- I. Ket qua thu nghiem ----
        heading("Kết quả thử nghiệm", "I"),
        subHeading("1. Bảng thời gian thực hiện"),
        resultTable,
        new Paragraph({
          spacing: { before: 80, after: 200 },
          children: [new TextRun({ text: "Môi trường thử nghiệm: biên dịch g++ -O2 -std=c++17; mỗi dãy ~1.000.000 số thực (kiểu double); dữ liệu sinh ngẫu nhiên với seed cố định = 2026 để đảm bảo khả năng tái lập.", italics: true, font: FONT, size: 18 })],
        }),

        subHeading("2. Biểu đồ (cột) thời gian thực hiện"),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new ImageRun({
              data: chartImage,
              transformation: { width: 680, height: 350 },
              type: "png",
            }),
          ],
        }),

        new Paragraph({ children: [new PageBreak()] }),

        // ---- II. Ket luan ----
        heading("Kết luận", "II"),
        body("Từ bảng số liệu và biểu đồ thực nghiệm trên 10 bộ dữ liệu (mỗi bộ ~1.000.000 số thực), có thể rút ra một số nhận xét sau:"),
        body("• std::sort (C++) cho thời gian thực thi trung bình thấp nhất (~72 ms) trong cả 10 bộ dữ liệu, kể cả với dữ liệu đã có thứ tự (tăng/giảm dần) lẫn dữ liệu ngẫu nhiên. Điều này phù hợp với lý thuyết vì std::sort trong thư viện chuẩn C++ cài đặt thuật toán Introsort — kết hợp QuickSort, HeapSort và Insertion Sort, cùng nhiều tối ưu hóa ở mức mã máy (cache locality, loop unrolling, tránh đệ quy sâu...) mà một cài đặt thủ công khó đạt được."),
        body("• QuickSort (tự cài đặt, chọn pivot ngẫu nhiên) có thời gian thực thi trung bình đứng thứ 2 (~90 ms), nhanh hơn rõ rệt trên dữ liệu đã có thứ tự (bộ 1, 2: ~36–42 ms) so với dữ liệu ngẫu nhiên (~95–119 ms). Nhờ chọn pivot ngẫu nhiên, thuật toán tránh được trường hợp xấu nhất O(n²) thường gặp khi dùng pivot cố định trên dữ liệu đã sắp xếp."),
        body("• MergeSort có thời gian ổn định hơn giữa các bộ dữ liệu (dao động ít), do độ phức tạp luôn là O(n log n) bất kể thứ tự đầu vào, nhưng tốn thêm bộ nhớ phụ O(n) cho việc trộn (merge), nên nhìn chung chậm hơn QuickSort trên dữ liệu ngẫu nhiên."),
        body("• HeapSort có thời gian thực thi trung bình cao nhất (~139 ms) dù độ phức tạp lý thuyết cũng là O(n log n). Nguyên nhân chủ yếu là do heap truy cập bộ nhớ không liên tục (non-sequential memory access khi sift-down giữa các mức của cây nhị phân), gây nhiều cache-miss hơn so với MergeSort và QuickSort vốn duyệt mảng tuần tự hơn."),
        body("• Với 2 bộ dữ liệu đã có thứ tự sẵn (bộ 1 tăng dần, bộ 2 giảm dần), tất cả 4 thuật toán đều chạy nhanh hơn đáng kể so với 8 bộ dữ liệu ngẫu nhiên còn lại, đặc biệt là std::sort và MergeSort giảm hơn 4–6 lần thời gian thực thi."),
        body("Tóm lại, kết quả thực nghiệm phù hợp với độ phức tạp lý thuyết O(n log n) của cả 4 thuật toán, đồng thời cho thấy rõ ảnh hưởng của yếu tố cài đặt thực tế (cache locality, hằng số ẩn trong O-lớn) đến hiệu năng thực thi, chứ không chỉ phụ thuộc vào độ phức tạp tiệm cận."),

        // ---- III. Thong tin chi tiet ----
        heading("Thông tin chi tiết – link GitHub", "III"),
        body(`Toàn bộ mã nguồn, dữ liệu thử nghiệm và báo cáo được lưu trữ công khai (public) tại:`),
        new Paragraph({
          spacing: { after: 160 },
          children: [new TextRun({ text: GITHUB_URL, font: FONT, size: 22, bold: true, color: "2a78d6", underline: {} })],
        }),
        body("Repository bao gồm:", { bold: false }),
        body("1. Báo cáo (file PDF báo cáo kết quả thử nghiệm này)"),
        body("2. Mã nguồn (chương trình sinh dữ liệu, cài đặt 4 thuật toán sắp xếp, chương trình đo thời gian thực thi, script vẽ biểu đồ)"),
        body("3. Dữ liệu thử nghiệm (10 bộ dữ liệu nhị phân đã sinh, và file kết quả CSV)"),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("report/BaoCao_ThucNghiem_Sap_Xep.docx", buffer);
  console.log("Da tao report/BaoCao_ThucNghiem_Sap_Xep.docx");
});
