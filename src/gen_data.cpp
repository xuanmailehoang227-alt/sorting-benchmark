// gen_data.cpp
// Sinh 10 dãy số thực ngẫu nhiên, khoảng 1 triệu phần tử mỗi dãy.
// Dãy 1: tăng dần
// Dãy 2: giảm dần
// Dãy 3..10: thứ tự ngẫu nhiên
//
// Định dạng file nhị phân (.bin):
//   8 byte đầu : int64_t  n  (số lượng phần tử)
//   n * 8 byte  : double  giá trị các phần tử
//
// Dùng seed cố định để đảm bảo khả năng tái lập thực nghiệm.

#include <algorithm>
#include <cstdint>
#include <fstream>
#include <iostream>
#include <random>
#include <string>
#include <vector>

const int64_t N = 1000000;      // ~1 triệu phần tử mỗi dãy
const unsigned SEED = 2026;     // seed cố định để tái lập được thực nghiệm
const double LO = 0.0;
const double HI = 1000000.0;

void saveBinary(const std::string &path, const std::vector<double> &v) {
    std::ofstream out(path, std::ios::binary);
    int64_t n = static_cast<int64_t>(v.size());
    out.write(reinterpret_cast<const char *>(&n), sizeof(n));
    out.write(reinterpret_cast<const char *>(v.data()), n * sizeof(double));
    out.close();
}

int main() {
    std::mt19937_64 rng(SEED);
    std::uniform_real_distribution<double> dist(LO, HI);

    for (int d = 1; d <= 10; d++) {
        std::vector<double> v(N);
        for (int64_t i = 0; i < N; i++) {
            v[i] = dist(rng);
        }

        if (d == 1) {
            std::sort(v.begin(), v.end());                       // tăng dần
        } else if (d == 2) {
            std::sort(v.begin(), v.end(), std::greater<double>()); // giảm dần
        }
        // d = 3..10: giữ nguyên thứ tự ngẫu nhiên vừa sinh

        char fname[64];
        snprintf(fname, sizeof(fname), "data/seq%02d.bin", d);
        saveBinary(fname, v);

        std::cout << "Da sinh " << fname << " voi " << v.size()
                  << " phan tu (" << (d == 1 ? "tang dan" : d == 2 ? "giam dan" : "ngau nhien")
                  << ")\n";
    }

    std::cout << "Hoan tat sinh du lieu.\n";
    return 0;
}
