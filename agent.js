(async () => {
  const getAnswer = async (question) => {
    try {
      console.log('Sending vocabulary word:', question);
      const res = await fetch("https://grammar-agent.onrender.com/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
      });
      const data = await res.json();
      console.log('Received answer:', data);
      if (data.error) {
        console.error('API Error:', data.error);
        return null;
      }
      return data.answer.toLowerCase().trim();
    } catch (error) {
      console.error('Error getting answer:', error);
      return null;
    }
  };

  const findQuestionAndOptions = () => {
    // FreeRice specific selectors
    const questionElement = document.querySelector('.card-title');
    const optionButtons = Array.from(document.querySelectorAll('.card-options button'));

    if (questionElement) {
      console.log('Found vocabulary word:', questionElement.innerText);
    } else {
      console.log('No vocabulary word found');
    }

    if (optionButtons.length > 0) {
      console.log('Found answer options:', optionButtons.map(btn => btn.innerText));
    } else {
      console.log('No answer options found');
    }

    return {
      questionElement,
      optionButtons
    };
  };

  const findBestMatch = (answer, options) => {
    // Clean and normalize the answer
    const cleanAnswer = answer.toLowerCase().trim();
    
    // First try exact match
    for (const option of options) {
      if (option.toLowerCase().trim() === cleanAnswer) {
        return option;
      }
    }

    // Then try partial match
    for (const option of options) {
      const cleanOption = option.toLowerCase().trim();
      if (cleanOption.includes(cleanAnswer) || cleanAnswer.includes(cleanOption)) {
        return option;
      }
    }

    return null;
  };

  const interval = setInterval(async () => {
    try {
      const { running } = await chrome.storage.local.get("running");
      if (!running) {
        console.log('Extension stopped');
        return clearInterval(interval);
      }

      const { questionElement, optionButtons } = findQuestionAndOptions();
      
      if (questionElement && optionButtons.length > 0) {
        const questionText = questionElement.innerText.trim();
        console.log('Processing vocabulary word:', questionText);
        
        const answer = await getAnswer(questionText);
        if (answer) {
          console.log('Looking for matching answer:', answer);
          const bestMatch = findBestMatch(answer, optionButtons.map(btn => btn.innerText));
          
          if (bestMatch) {
            console.log('Found matching answer:', bestMatch);
            const buttonToClick = optionButtons.find(btn => 
              btn.innerText.toLowerCase().trim() === bestMatch.toLowerCase().trim()
            );
            if (buttonToClick) {
              console.log('Clicking button with text:', buttonToClick.innerText);
              buttonToClick.click();
            }
          } else {
            console.log('No matching answer found');
          }
        }
      } else {
        console.log('No vocabulary word or options found');
      }
    } catch (error) {
      console.error('Error in interval:', error);
    }
  }, 3000);

  console.log('Grammar Agent initialized');
})();