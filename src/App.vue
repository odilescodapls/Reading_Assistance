<template>
  <div id="app">
    <h1>Reading Assistant</h1>

    <input type="text" v-model="url" placeholder="Enter webpage URL" />
    <button @click="fetchWebpageContent">Load Webpage</button>

    <div v-if="loading" class="loader">Loading...</div>

    <div v-if="!loading" class="text-container" ref="textContainer">
      <div v-for="(line, lineIndex) in lines" :key="lineIndex">
        <span
          v-for="(word, wordIndex) in line"
          :key="wordIndex"
          :class="{
            highlight: isHoveredLine(lineIndex),
            highlightNext: isNextLine(lineIndex),
          }"
          :data-word-ref="'word-' + lineIndex + '-' + wordIndex"
        >
          {{ word }}&nbsp;
        </span>
        <br />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';

export default {
  setup() {
    const text = ref('');
    const url = ref('');
    const lines = ref([]);
    const hoveredLineIndex = ref(null);
    const loading = ref(false);
    const textContainer = ref(null);

    const splitIntoLines = () => {
      const charsPerLine = 175;
      lines.value = text.value.split(' ').reduce((acc, word) => {
        const lastLine = acc[acc.length - 1];
        if (lastLine && lastLine.join(' ').length + word.length < charsPerLine) {
          lastLine.push(word);
        } else {
          acc.push([word]);
        }
        return acc;
      }, []);
    };

    const handleMouseMove = (event) => {
      if (!textContainer.value) return;

      hoveredLineIndex.value = null;

      const allWords = textContainer.value.querySelectorAll('span');

      allWords.forEach((wordSpan) => {
        const rect = wordSpan.getBoundingClientRect();
        if (
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom
        ) {
          const refValue = wordSpan.getAttribute('data-word-ref');
          if (refValue) {
            const [, lineIndex] = refValue.split('-');
            hoveredLineIndex.value = parseInt(lineIndex);
          }
        }
      });

      allWords.forEach((wordSpan) => {
        wordSpan.classList.remove('highlight');
        wordSpan.classList.remove('highlightNext');
      });

      if (hoveredLineIndex.value !== null) {
        lines.value[hoveredLineIndex.value].forEach((_, wordIndex) => {
          const wordRef = `word-${hoveredLineIndex.value}-${wordIndex}`;
          const wordSpan = textContainer.value.querySelector(`[data-word-ref="${wordRef}"]`);
          if (wordSpan) {
            wordSpan.classList.add('highlight');
          }
        });

        if (lines.value[hoveredLineIndex.value + 1]) {
          lines.value[hoveredLineIndex.value + 1].forEach((_, wordIndex) => {
            const wordRef = `word-${hoveredLineIndex.value + 1}-${wordIndex}`;
            const wordSpan = textContainer.value.querySelector(`[data-word-ref="${wordRef}"]`);
            if (wordSpan) {
              wordSpan.classList.add('highlightNext');
            }
          });
        }
      }
    };

    const isHoveredLine = (lineIndex) => {
      return lineIndex === hoveredLineIndex.value;
    };

    const isNextLine = (lineIndex) => {
      return lineIndex === hoveredLineIndex.value + 1;
    };

    const fetchWebpageContent = async () => {
      loading.value = true;
      try {
        if (!url.value.startsWith('http://') && !url.value.startsWith('https://')) {
          url.value = 'https://' + url.value;
        }

        const corsProxy = 'https://api.allorigins.win/get?url=';
        const response = await fetch(`${corsProxy}${encodeURIComponent(url.value)}`);

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }

        const json = await response.json();
        const parser = new DOMParser();
        const doc = parser.parseFromString(json.contents, 'text/html');

        const rawText = doc.body.innerText;
        const cleanText = rawText.replace(/\n+/g, ' ');
        text.value = cleanText;
        splitIntoLines();
      } catch (error) {
        console.error('Error fetching the webpage:', error);
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      textContainer.value = document.querySelector('.text-container');
      if (textContainer.value) {
        window.addEventListener('mousemove', handleMouseMove);
      }
    });

    onBeforeUnmount(() => {
      window.removeEventListener('mousemove', handleMouseMove);
    });

    return {
      lines,
      url,
      fetchWebpageContent,
      isHoveredLine,
      isNextLine,
      loading,
      textContainer,
    };
  },
};
</script>

<style scoped>
.text-container {
  width: 100%;
  line-height: 1.8;
  font-size: 18px;
  white-space: normal;
  word-wrap: break-word;
}
html, body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: 'Georgia', 'serif';
  background-color: #f5f5f5;
}

#app {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  background-color: #ffffff;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

h1 {
  font-size: 36px;
  text-align: center;
  margin-bottom: 20px;
}

input {
  width: 60%;
  margin: 20px 0;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 10px 15px;
  font-size: 16px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.loader {
  font-size: 20px;
  color: #007BFF;
  text-align: center;
  margin: 20px 0;
}

.highlight {
  background-color: lightblue;
  font-weight: bold;
}

.highlightNext {
  background-color: lightyellow;
}
</style>
