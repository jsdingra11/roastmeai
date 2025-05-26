
    let currentRoast = '';

    async function generateRoast() {
      const nameInput = document.getElementById('nameInput');
      const name = nameInput.value.trim() || 'Anonymous';
      const roastOutput = document.getElementById('roastOutput');
      const roastCard = document.getElementById('roastCard');
      const roastCardText = document.getElementById('roastCardText');

      roastOutput.classList.remove('hidden');
      roastCard.classList.add('hidden');
      roastOutput.classList.add('shake');
      roastOutput.textContent = 'Preparing your roast... 🔥';

      try {
        const response = await fetch(
          'https://r0c8kgwocscg8gsokogwwsw4.zetaverse.one/ai',
          {
            method: 'POST',
            headers: {
              Authorization: 'Bearer sk-7153dfb99e404165861c978e3766a395',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messages: [
                {
                  role: 'user',
                  content: [
                    {
                      type: 'text',
                      text: `Generate 1 line, funny roast lines for someone who calls themselves "${name}". Keep it sharp, shameful and funny`,
                    },
                  ],
                },
              ],
            }),
          }
        );

        const data = await response.json();

        if (!data.message) throw new Error('No message in response');

        currentRoast = data.message;

        roastOutput.innerHTML = '';

        // New typewriter code - no erase after typing
        const typewriter = new Typewriter(roastOutput, {
          delay: 50,
          cursor: '|',
          autoStart: true,
          loop: false,
        });

        typewriter.typeString(currentRoast).start();

        roastCardText.textContent = currentRoast;
        roastCard.classList.remove('hidden');
      } catch (error) {
        roastOutput.textContent =
          'Sorry, something went wrong generating your roast. Please try again.';
        console.error(error);
      } finally {
        setTimeout(() => roastOutput.classList.remove('shake'), 500);
      }
    }

    async function downloadRoastCard() {
      const roastCard = document.getElementById('roastCard');
      if (roastCard.classList.contains('hidden')) return;

      const canvas = await html2canvas(roastCard);
      const link = document.createElement('a');
      link.download = 'roast-card.png';
      link.href = canvas.toDataURL();
      link.click();
    }

    function shareRoast() {
      if (!currentRoast) return;
      const shareText = encodeURIComponent(
        `Got roasted by AI! 🔥\n\n"${currentRoast}"\n\nTry it yourself at RoastMeAI!`
      );
      window.open(`https://twitter.com/intent/tweet?text=${shareText}`, '_blank');
    }
  