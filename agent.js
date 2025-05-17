(async () => {
  const getAnswer = async (question) => {
    const res = await fetch("http://127.0.0.1:5000/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question })
    });
    const data = await res.json();
    return data.answer.toLowerCase().trim();
  };

  const interval = setInterval(async () => {
    const { running } = await chrome.storage.local.get("running");
    if (!running) return clearInterval(interval);

    const questionText = document.querySelector("div").innerText.trim();
    const optionButtons = Array.from(document.querySelectorAll("button"));

    if (questionText && optionButtons.length > 0) {
      const answer = await getAnswer(questionText);

      for (const btn of optionButtons) {
        if (btn.innerText.toLowerCase().includes(answer)) {
          btn.click();
          break;
        }
      }
    }
  }, 3000);
})();