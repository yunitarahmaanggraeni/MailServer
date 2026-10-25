(() => {
  const app = document.querySelector("#quiz-app");
  if (!app) return;

  const questions = [
    {
      question: "Apa tindakan awal yang paling bijak saat menerima email mendesak yang meminta Anda masuk melalui tautan?",
      options: ["Klik secepatnya agar akun tidak ditutup", "Periksa alamat dan verifikasi lewat kanal resmi yang sudah dikenal", "Balas dengan meminta pengirim mengirim kata sandi", "Teruskan ke semua kontak untuk meminta pendapat"],
      answer: 1,
      explanation: "Desakan dapat digunakan untuk membuat penerima bertindak tanpa pemeriksaan. Verifikasi melalui aplikasi, alamat, atau nomor resmi yang sudah Anda kenal."
    },
    {
      question: "Dalam CIA Triad, prinsip yang menjaga informasi hanya dapat diakses pihak berwenang disebut…",
      options: ["Availability", "Integrity", "Confidentiality", "Interoperability"],
      answer: 2,
      explanation: "Confidentiality (kerahasiaan) membatasi akses informasi kepada pihak yang berwenang."
    },
    {
      question: "Apa fungsi utama SPF bagi domain pengirim email?",
      options: ["Mengenkripsi isi pesan dari ujung ke ujung", "Menyatakan server yang diizinkan mengirim email untuk domain", "Memindai semua lampiran untuk malware", "Memastikan setiap pesan ditulis pemilik domain"],
      answer: 1,
      explanation: "SPF menerbitkan kebijakan tentang host yang diizinkan mengirim email untuk domain. SPF bukan pemindai isi pesan."
    },
    {
      question: "Apa yang dilakukan DKIM pada pesan email?",
      options: ["Menambahkan tanda tangan digital yang dapat diperiksa penerima", "Menghapus semua pesan spam dari inbox", "Mewajibkan pengguna menggunakan MFA", "Mengganti TLS pada koneksi server"],
      answer: 0,
      explanation: "DKIM menambahkan tanda tangan digital yang memungkinkan pemeriksaan integritas bagian pesan dan keterkaitannya dengan domain penanda tangan."
    },
    {
      question: "Peran DMARC yang paling tepat adalah…",
      options: ["Mengatur kebijakan penanganan pesan berdasarkan hasil autentikasi domain dan alignment", "Mengenkripsi setiap lampiran secara otomatis", "Mengganti kebutuhan SPF dan DKIM sepenuhnya", "Membuktikan bahwa isi pesan tidak berbahaya"],
      answer: 0,
      explanation: "DMARC mengaitkan pemeriksaan SPF/DKIM dengan domain pada kolom From dan memungkinkan pemilik domain menyatakan kebijakan serta menerima laporan."
    },
    {
      question: "Apa perlindungan yang umumnya diberikan TLS pada komunikasi email?",
      options: ["Mencegah semua bentuk phishing", "Melindungi data saat transmisi pada koneksi yang menggunakan TLS", "Menjamin email tersimpan aman di setiap server", "Mengonfirmasi bahwa penerima adalah manusia"],
      answer: 1,
      explanation: "TLS melindungi koneksi selama transmisi. Perlindungan ini tidak otomatis mengenkripsi pesan tersimpan di setiap titik atau mencegah phishing."
    },
    {
      question: "Mengapa MFA membantu keamanan akun email?",
      options: ["Menghapus kebutuhan memperbarui perangkat", "Menambahkan faktor verifikasi selain kata sandi", "Memastikan pengirim email telah diautentikasi", "Menyaring lampiran secara otomatis"],
      answer: 1,
      explanation: "MFA menambahkan satu atau lebih faktor verifikasi sehingga kata sandi saja tidak menjadi satu-satunya penghalang akses."
    },
    {
      question: "Anda menerima permintaan kata sandi melalui email yang mengaku berasal dari dukungan teknis. Apa respons terbaik?",
      options: ["Kirim kata sandi agar masalah cepat selesai", "Kirim kata sandi lama saja", "Jangan bagikan rahasia; verifikasi dan laporkan melalui kanal resmi", "Balas dengan kode MFA tanpa kata sandi"],
      answer: 2,
      explanation: "Jangan membagikan kata sandi maupun kode MFA. Verifikasi permintaan secara terpisah dan ikuti prosedur pelaporan."
    },
    {
      question: "Manakah pernyataan yang benar tentang email yang lolos autentikasi SPF, DKIM, atau DMARC?",
      options: ["Isi pesan pasti aman dibuka", "Pengirim pasti orang yang Anda kenal", "Autentikasi membantu menilai domain, tetapi tidak menjamin isi pesan aman", "Tautan di dalam pesan sudah diperiksa"],
      answer: 2,
      explanation: "Autentikasi domain bukan penilaian lengkap atas niat, konten, lampiran, atau tautan dalam pesan."
    },
    {
      question: "Apa kebiasaan yang paling tepat saat menerima lampiran yang tidak Anda harapkan?",
      options: ["Buka segera jika nama pengirim terasa akrab", "Verifikasi dengan pengirim melalui kanal yang sudah diketahui sebelum membuka", "Teruskan ke akun pribadi untuk diperiksa", "Nonaktifkan perlindungan perangkat sementara"],
      answer: 1,
      explanation: "Nama tampilan dapat dipalsukan. Pastikan lampiran memang dikirim oleh pihak tersebut dan ikuti kebijakan keamanan organisasi."
    }
  ];

  let currentIndex = 0;
  let score = 0;
  let selectedIndex = null;
  const letters = ["A", "B", "C", "D"];

  const renderQuestion = () => {
    selectedIndex = null;
    const item = questions[currentIndex];
    const progressPercent = ((currentIndex + 1) / questions.length) * 100;
    app.innerHTML = `
      <div class="quiz-progress-head"><span>PERTANYAAN ${currentIndex + 1} DARI ${questions.length}</span><strong>${Math.round(progressPercent)}%</strong></div>
      <div class="quiz-progress-track" role="progressbar" aria-label="Progres kuis" aria-valuemin="0" aria-valuemax="${questions.length}" aria-valuenow="${currentIndex + 1}"><span style="width:${progressPercent}%"></span></div>
      <h3 class="quiz-question" tabindex="-1">${item.question}</h3>
      <div class="quiz-options" role="group" aria-label="Pilihan jawaban">
        ${item.options.map((option, index) => `<button class="quiz-option" type="button" data-answer="${index}"><span class="option-letter">${letters[index]}</span><span>${option}</span></button>`).join("")}
      </div>`;
    app.querySelector(".quiz-question").focus({ preventScroll: true });
    app.querySelectorAll(".quiz-option").forEach((button) => {
      button.addEventListener("click", () => selectAnswer(Number(button.dataset.answer)));
    });
  };

  const selectAnswer = (answerIndex) => {
    if (selectedIndex !== null) return;
    selectedIndex = answerIndex;
    const item = questions[currentIndex];
    const isCorrect = answerIndex === item.answer;
    if (isCorrect) score += 1;

    app.querySelectorAll(".quiz-option").forEach((button, index) => {
      button.disabled = true;
      if (index === item.answer) button.classList.add("is-correct");
      if (index === answerIndex && !isCorrect) button.classList.add("is-wrong");
    });

    const feedback = document.createElement("div");
    feedback.className = `quiz-feedback ${isCorrect ? "" : "is-incorrect"}`;
    feedback.setAttribute("role", "status");
    feedback.innerHTML = `<strong>${isCorrect ? "Tepat!" : "Belum tepat, tidak apa-apa."}</strong><p>${item.explanation}</p>`;
    const nextButton = document.createElement("button");
    nextButton.className = "quiz-next-button";
    nextButton.type = "button";
    nextButton.innerHTML = `${currentIndex === questions.length - 1 ? "Lihat hasil" : "Pertanyaan berikutnya"} <span aria-hidden="true">→</span>`;
    nextButton.addEventListener("click", () => {
      currentIndex += 1;
      if (currentIndex < questions.length) renderQuestion();
      else renderResult();
    });
    app.append(feedback, nextButton);
    nextButton.focus();
  };

  const renderResult = () => {
    const percent = Math.round((score / questions.length) * 100);
    const title = score >= 8 ? "Fondasi yang kuat!" : score >= 5 ? "Terus asah kewaspadaan." : "Setiap jawaban jadi bekal.";
    const description = score >= 8
      ? "Kamu sudah memahami banyak prinsip penting. Tetap verifikasi pesan dalam konteks nyata."
      : "Ulangi materi dan pembahasan untuk memperkuat pemahaman. Keamanan dibangun dengan kebiasaan belajar.";
    app.innerHTML = `
      <div class="quiz-result">
        <div class="quiz-result-score">${score}<small> / ${questions.length}</small></div>
        <h3>${title}</h3>
        <p>${description} Skor latihan: ${percent}% jawaban benar.</p>
        <details class="quiz-review"><summary>Lihat pembahasan semua pertanyaan</summary><ol>
          ${questions.map((item, index) => `<li><b>${item.question}</b><br>Jawaban benar: ${item.options[item.answer]}. ${item.explanation}</li>`).join("")}
        </ol></details>
        <button class="quiz-restart-button" type="button">Ulangi kuis <span aria-hidden="true">↻</span></button>
      </div>`;
    app.querySelector(".quiz-restart-button").addEventListener("click", () => {
      currentIndex = 0;
      score = 0;
      renderQuestion();
    });
    app.querySelector("h3").focus({ preventScroll: true });
  };

  renderQuestion();
})();
