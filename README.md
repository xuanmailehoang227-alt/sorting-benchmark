# Thực nghiệm so sánh các thuật toán sắp xếp

So sánh thời gian thực thi của QuickSort, HeapSort, MergeSort (tự cài đặt) và
`std::sort` của C++ trên 10 bộ dữ liệu số thực, mỗi bộ khoảng 1.000.000 phần tử.

- Bộ dữ liệu 1: đã sắp xếp **tăng dần**
- Bộ dữ liệu 2: đã sắp xếp **giảm dần**
- Bộ dữ liệu 3 → 10: thứ tự **ngẫu nhiên**

## Cấu trúc repository

```
.
├── src/
│   ├── gen_data.cpp          # Sinh 10 bộ dữ liệu ngẫu nhiên (.bin)
│   ├── sort_algorithms.hpp   # Cài đặt QuickSort, HeapSort, MergeSort
│   ├── benchmark.cpp         # Đo thời gian thực thi, xuất results.csv
│   └── make_chart.py         # Vẽ biểu đồ cột từ results.csv
├── data/                     # 10 bộ dữ liệu nhị phân đã sinh (seq01.bin .. seq10.bin)
├── results/
│   ├── results.csv           # Kết quả thời gian thực thi (ms)
│   └── chart.png             # Biểu đồ cột so sánh 4 thuật toán
├── report/
│   ├── make_report.js        # Script sinh báo cáo .docx (docx-js)
│   ├── BaoCao_ThucNghiem_Sap_Xep.docx
│   └── BaoCao_ThucNghiem_Sap_Xep.pdf   # Báo cáo nộp (PDF)
└── README.md
```

## Định dạng dữ liệu (`data/seq*.bin`)

File nhị phân:
- 8 byte đầu: `int64_t n` — số lượng phần tử
- `n * 8` byte tiếp theo: mảng `double` — giá trị các phần tử

## Cách chạy lại thực nghiệm

```bash
# 1. Biên dịch
g++ -O2 -std=c++17 -o gen_data src/gen_data.cpp
g++ -O2 -std=c++17 -o benchmark src/benchmark.cpp

# 2. Sinh dữ liệu (ghi vào thư mục data/)
./gen_data

# 3. Chạy thực nghiệm (ghi kết quả vào results/results.csv)
./benchmark

# 4. Vẽ biểu đồ (ghi vào results/chart.png)
python3 src/make_chart.py

# 5. (Tùy chọn) Tạo lại báo cáo .docx
cd report && node make_report.js
```

Dữ liệu được sinh với seed cố định (`2026`) để đảm bảo khả năng tái lập thực nghiệm.

## Kết quả tóm tắt (thời gian trung bình trên 10 bộ dữ liệu)

| Thuật toán   | Thời gian trung bình (ms) |
|--------------|---------------------------|
| QuickSort    | ~90.5                     |
| HeapSort     | ~139.5                    |
| MergeSort    | ~114.3                    |
| std::sort    | ~72.2                     |

Xem chi tiết và nhận xét đầy đủ trong [báo cáo PDF](report/BaoCao_ThucNghiem_Sap_Xep.pdf).

## Môi trường thực nghiệm

- Biên dịch: `g++ -O2 -std=c++17`
- Mỗi dãy: ~1.000.000 số thực (kiểu `double`)
- Hệ điều hành: Linux
