const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const chatbox = document.getElementById('chatbox');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

// GPT 응답 가져오기
async function fetchGPTResponse(prompt) {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Unknown error from API");
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error("API Error:", error);
    return "죄송합니다, 응답을 가져오는 중 오류가 발생했습니다.";
  }
}

// 메시지 전송 함수
async function sendMessage() {
  const prompt = userInput.value.trim();
  if (!prompt) return;

  chatbox.innerHTML += `<div class="text-right mb-2 text-blue-600">나: ${prompt}</div>`;
  userInput.value = '';
  chatbox.scrollTop = chatbox.scrollHeight;

  sendBtn.disabled = true;
  const reply = await fetchGPTResponse(prompt);
  sendBtn.disabled = false;

  chatbox.innerHTML += `<div class="text-left mb-2 text-gray-800">GPT: ${reply}</div>`;
  chatbox.scrollTop = chatbox.scrollHeight;
}

// 버튼 클릭 이벤트
sendBtn.addEventListener('click', sendMessage);

// 엔터 키 입력 이벤트
userInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault(); // 줄바꿈 방지
    sendMessage();
  }
});
