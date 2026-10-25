(() => {
  const app = document.querySelector("#simulation-app");
  if (!app) return;

  const scenarios = [
    {
      sender: "Tim Notifikasi",
      address: "notifikasi-keamanan@example.net",
      subject: "Tindakan diperlukan dalam 15 menit",
      body: [
        "Halo,",
        "Akses akun Anda akan dihentikan dalam 15 menit. Segera verifikasi untuk menghindari kehilangan akses.",
        "Tinjau akun: "
      ],
      link: "contoh-verifikasi.example.net",
      indicators: ["Tekanan waktu", "Ancaman kehilangan akses", "Domain perlu diverifikasi"],
      answer: "suspicious",
      explanation: "Pesan menggabungkan desakan waktu dan ancaman kehilangan akses untuk mendorong tindakan tanpa berpikir. Domain pada contoh juga perlu diverifikasi melalui kanal resmi yang sudah diketahui.",
      action: "Jangan buka tautan. Kunjungi layanan melalui alamat yang biasa Anda gunakan atau hubungi dukungan resmi secara terpisah."
    },
    {
      sender: "Ruang Akademik",
      address: "akademik@ruang-kampus.example.org",
      subject: "Pembaruan jadwal konsultasi",
      body: [
        "Selamat siang,",
        "Terlampir informasi jadwal konsultasi yang Anda minta. Untuk memastikan perubahan ini benar, silakan konfirmasi kepada staf melalui kanal kampus yang biasa digunakan.",
        "Rincian jadwal: "
      ],
      link: "jadwal.example.org/konsultasi",
      indicators: ["Alamat dan konteks tampak selaras", "Tidak meminta kredensial", "Tetap verifikasi perubahan"],
      answer: "reasonable",
      explanation: "Konteks permintaan sesuai dan pesan tidak meminta kata sandi atau data rahasia. Namun tampilan yang wajar bukan bukti bahwa pengirim benar-benar terverifikasi; contoh tautan pun hanya teks latihan.",
      action: "Bila pesan ini sungguhan, pastikan permintaan memang Anda lakukan dan periksa alamat tujuan sebelum membuka tautan atau lampiran."
    },
    {
      sender: "Layanan Dokumen",
      address: "berkas@layanan-dokumen.example.com",
      subject: "Mohon balas dengan kata sandi email",
      body: [
        "Halo,",
        "Untuk membuka dokumen, balas email ini dengan kata sandi akun email dan kode verifikasi yang baru Anda terima.",
        "Dokumen: "
      ],
      link: "dokumen.example.com/akses",
      indicators: ["Meminta kata sandi", "Meminta kode verifikasi", "Informasi rahasia diminta lewat email"],
      answer: "suspicious",
      explanation: "Permintaan kata sandi atau kode verifikasi melalui email adalah tanda bahaya kuat. Kredensial dan kode tersebut memberi akses ke akun dan tidak boleh dibagikan.",
      action: "Jangan membalas atau membuka tautan. Laporkan pesan, lalu hubungi layanan terkait melalui kanal resmi."
    },
    {
      sender: "Kabar Mingguan",
      address: "buletin@info.example.net",
      subject: "Ringkasan bacaan pilihan pekan ini",
      body: [
        "Halo,",
        "Berikut ringkasan bacaan mingguan yang Anda daftarkan. Anda dapat mengabaikan email ini jika tidak lagi ingin menerima buletin.",
        "Preferensi langganan: "
      ],
      link: "info.example.net/preferensi",
      indicators: ["Isi promosi yang relatif wajar", "Tidak ada desakan", "Periksa langganan dan domain"],
      answer: "reasonable",
      explanation: "Isi pesan relatif wajar dan tidak meminta informasi sensitif, tetapi kita belum dapat memastikan siapa pengirimnya hanya dari tampilannya. Pesan yang tampak biasa pun tetap perlu dinilai sesuai konteks.",
      action: "Jika Anda memang berlangganan, periksa domain dan tujuan tautan sebelum menggunakannya. Jika tidak mengenali pengirim, abaikan atau laporkan."
    },
    {
      sender: "Layanan Surat",
      address: "sistem@surat.example.com",
      subject: "Laporan status autentikasi pesan",
      body: [
        "Halo,",
        "Laporan contoh menyatakan pemeriksaan SPF dan DKIM lulus serta kebijakan DMARC diterapkan. Hasil tersebut berkaitan dengan autentikasi domain, bukan penilaian keamanan isi.",
        "Panduan pengelolaan: "
      ],
      link: "panduan.example.com/pengelolaan",
      indicators: ["SPF/DKIM/DMARC disebut", "Hasil autentikasi bukan jaminan aman", "Pengirim tetap perlu dikonfirmasi"],
      answer: "reasonable",
      explanation: "Pembahasan SPF, DKIM, dan DMARC adalah konteks teknis yang masuk akal. Mekanisme tersebut membantu autentikasi domain, tetapi tidak membuktikan bahwa isi email aman atau bahwa permintaannya patut diikuti.",
      action: "Periksa konteks, domain, dan tujuan pesan. Untuk urusan penting, verifikasi melalui kanal terpisah yang Anda percaya."
    }
  ];

  let currentIndex = 0;
  let checkedCount = 0;
  let selectedAnswer = "";

  const progress = document.querySelector("#sim-progress");
  const stepLabel = document.querySelector("#sim-step");

  const renderScenario = () => {
    selectedAnswer = "";
    const scenario = scenarios[currentIndex];
    if (progress) progress.style.width = `${((currentIndex + 1) / scenarios.length) * 100}%`;
    if (stepLabel) stepLabel.textContent = `Skenario ${currentIndex + 1} dari ${scenarios.length}`;

    app.innerHTML = `
      <div class="sim-email-top"><span>CONTOH PESAN · TIDAK TERKIRIM</span><span class="sim-message-count">${currentIndex + 1} / ${scenarios.length}</span></div>
      <div class="sim-sender-row">
        <span class="sim-sender-avatar" aria-hidden="true">${scenario.sender.charAt(0)}</span>
        <div class="sim-sender-meta"><b>${scenario.sender}</b><span>${scenario.address}</span></div>
      </div>
      <h3 class="sim-subject" tabindex="-1">${scenario.subject}</h3>
      <div class="sim-email-body">
        ${scenario.body.slice(0, -1).map((paragraph) => `<p>${paragraph}</p>`).join("")}
        <p>${scenario.body[scenario.body.length - 1]}<br><span class="sim-url-display">${scenario.link}</span></p>
      </div>
      <p class="sim-indicator-label">PETUNJUK UNTUK DIPERIKSA</p>
      <ul class="indicator-list">${scenario.indicators.map((indicator) => `<li>${indicator}</li>`).join("")}</ul>
      <form class="sim-answer-form">
        <fieldset>
          <legend>Bagaimana penilaian awalmu?</legend>
          <div class="answer-option"><input type="radio" id="answer-suspicious" name="email-assessment" value="suspicious"><label for="answer-suspicious">Mencurigakan</label></div>
          <div class="answer-option"><input type="radio" id="answer-reasonable" name="email-assessment" value="reasonable"><label for="answer-reasonable">Tampak wajar</label></div>
        </fieldset>
        <button class="sim-check-button" type="submit">Periksa penilaian <span aria-hidden="true">→</span></button>
        <p class="form-error" role="alert" hidden>Pilih salah satu penilaian sebelum memeriksa.</p>
      </form>`;

    app.querySelector(".sim-subject").focus({ preventScroll: true });
    app.querySelector(".sim-answer-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const choice = app.querySelector('input[name="email-assessment"]:checked');
      const error = app.querySelector(".form-error");
      if (!choice) {
        error.hidden = false;
        app.querySelector("#answer-suspicious").focus();
        return;
      }
      checkedCount += Number(choice.value === scenario.answer);
      showFeedback(scenario, choice.value === scenario.answer);
    });
  };

  const showFeedback = (scenario, isCorrect) => {
    app.querySelectorAll('input[name="email-assessment"]').forEach((input) => { input.disabled = true; });
    app.querySelector(".sim-check-button").remove();
    const feedback = document.createElement("section");
    feedback.className = `sim-feedback ${isCorrect ? "is-correct" : "is-review"}`;
    feedback.setAttribute("aria-live", "polite");
    const resultTitle = isCorrect
      ? "Penilaianmu sesuai dengan skenario."
      : "Mari lihat lagi petunjuknya.";
    feedback.innerHTML = `
      <h3>${resultTitle}</h3>
      <p>${scenario.explanation}</p>
      <p class="suggestion"><b>Saran:</b> ${scenario.action}</p>
      <button class="sim-next-button" type="button">${currentIndex === scenarios.length - 1 ? "Lihat rangkuman" : "Email berikutnya"} <span aria-hidden="true">→</span></button>`;
    app.querySelector(".sim-answer-form").append(feedback);
    feedback.querySelector("button").addEventListener("click", () => {
      currentIndex += 1;
      if (currentIndex < scenarios.length) renderScenario();
      else renderComplete();
    });
    feedback.querySelector("button").focus();
  };

  const renderComplete = () => {
    if (progress) progress.style.width = "100%";
    if (stepLabel) stepLabel.textContent = `Selesai · ${checkedCount} dari ${scenarios.length} penilaian sesuai`;
    app.innerHTML = `
      <div class="sim-complete">
        <span class="sim-complete-mark" aria-hidden="true">✓</span>
        <h3>Latihan inbox selesai.</h3>
        <p>${checkedCount} dari ${scenarios.length} penilaianmu sesuai dengan fokus latihan. Ingat: email yang tampak wajar belum tentu aman—selalu cek konteks dan verifikasi identitas.</p>
        <button class="sim-check-button" type="button">Ulangi simulasi <span aria-hidden="true">↻</span></button>
      </div>`;
    app.querySelector("button").addEventListener("click", () => {
      currentIndex = 0;
      checkedCount = 0;
      renderScenario();
    });
    app.querySelector("h3").focus({ preventScroll: true });
  };

  renderScenario();
})();
