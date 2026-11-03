function updateWordCount() {

    const essay = document.getElementById("essay").value;

    const words = essay.trim() === ""
        ? []
        : essay.trim().split(/\s+/);

    document.getElementById("wordCount").innerText = words.length;

    document.getElementById("charCount").innerText = essay.length;
}


// Evaluate Essay
function evaluateEssay() {

    const essay = document.getElementById("essay").value.trim();

    if (essay === "") {

        alert("Please enter your essay.");

        return;
    }


    // Words
    const words = essay.split(/\s+/);

    const wordCount = words.length;


    // Sentences
    const sentences = essay
        .split(/[.!?]+/)
        .filter(sentence => sentence.trim() !== "");

    const sentenceCount = sentences.length;


    // Unique words
    const uniqueWords = new Set(
        words.map(word =>
            word.toLowerCase().replace(/[.,!?;:"']/g, "")
        )
    );


    // Vocabulary ratio
    const vocabularyRatio =
        uniqueWords.size / wordCount;


    /*
        SCORE CALCULATION

        The score is calculated from:
        1. Essay length
        2. Sentence development
        3. Vocabulary variety
    */

    let score = 0;


    // Essay length score
    if (wordCount < 30) {
        score += 1;
    }
    else if (wordCount < 60) {
        score += 2;
    }
    else if (wordCount < 100) {
        score += 3;
    }
    else if (wordCount < 150) {
        score += 4;
    }
    else if (wordCount < 200) {
        score += 5;
    }
    else if (wordCount < 250) {
        score += 6;
    }
    else if (wordCount < 300) {
        score += 7;
    }
    else if (wordCount < 400) {
        score += 8;
    }
    else if (wordCount < 500) {
        score += 9;
    }
    else {
        score += 10;
    }


    /*
        Sentence and vocabulary adjustment
    */

    if (sentenceCount >= 8 && vocabularyRatio >= 0.60) {

        score += 1;

    }
    else if (sentenceCount < 3 && vocabularyRatio < 0.40) {

        score -= 1;

    }


    // Keep score between 1 and 10
    score = Math.max(1, Math.min(10, score));


    // Display score
    document.getElementById("score").innerText = score;


    // Display word count
    document.getElementById("resultWords").innerText = wordCount;


    // Display sentence count
    document.getElementById("sentences").innerText = sentenceCount;


    // Vocabulary result
    if (vocabularyRatio >= 0.65) {

        document.getElementById("vocabulary").innerText = "Excellent";

    }
    else if (vocabularyRatio >= 0.50) {

        document.getElementById("vocabulary").innerText = "Good";

    }
    else if (vocabularyRatio >= 0.35) {

        document.getElementById("vocabulary").innerText = "Average";

    }
    else {

        document.getElementById("vocabulary").innerText = "Basic";
    }


    // Generate score-based feedback
    generateFeedback(score);
}



// Score-based Feedback
function generateFeedback(score) {

    const feedback = document.getElementById("feedback");


    // Feedback paragraphs for 1-10
    const feedbackMessages = {

        1:
        "The essay shows very limited understanding of the given topic. The ideas are unclear and insufficiently developed. There are several grammar, spelling, and sentence-formation errors. The essay lacks proper organization and supporting details. Significant improvement is needed in content, structure, grammar, and clarity.",


        2:
        "The essay demonstrates a basic attempt to address the topic, but the ideas are not clearly explained. There are frequent grammar and spelling mistakes, and the sentences may be difficult to understand. The essay needs better organization and more relevant supporting points.",


        3:
        "The essay addresses the topic to some extent, but the explanation is limited. Some relevant ideas are present, although they are not developed properly. Grammar, vocabulary, and sentence structure need improvement. Better organization and additional supporting details would strengthen the essay.",


        4:
        "The essay shows a developing understanding of the topic. Some relevant points are included, but the ideas could be explained more clearly. There are noticeable language and grammatical errors. The essay would benefit from improved structure, vocabulary, and supporting examples.",


        5:
        "The essay provides a reasonable response to the topic and includes some relevant ideas. The overall structure is acceptable, but some points require further explanation. There are a few grammar and vocabulary issues. With better organization and more detailed supporting arguments, the essay could be improved.",


        6:
        "The essay demonstrates a good understanding of the topic and presents several relevant ideas. The content is generally organized and understandable. There are some minor grammar or vocabulary errors, but they do not significantly affect the meaning. More detailed examples and stronger development would improve the essay further.",


        7:
        "The essay demonstrates a strong understanding of the topic and presents relevant ideas in a logical manner. The content is well organized, with good supporting details and appropriate vocabulary. Only a few minor language errors are present. Overall, the essay is clear, effective, and well developed.",


        8:
        "The essay provides a clear and well-developed response to the topic. Ideas are logically organized and supported with relevant explanations or examples. The vocabulary and sentence structure are strong, with very few errors. The essay communicates its message effectively and demonstrates good writing ability.",


        9:
        "The essay demonstrates an excellent understanding of the topic and presents well-developed, relevant, and convincing ideas. The organization is clear and coherent, and the vocabulary is appropriate and varied. Grammar and sentence structure are strong, with only very minor errors. Overall, this is a highly effective piece of writing.",


        10:
        "The essay provides an exceptional response to the given topic. It presents clear, original, and well-developed ideas supported by strong explanations and relevant examples. The essay has excellent organization, coherence, vocabulary, grammar, and sentence structure. The writing is polished, engaging, and highly effective, demonstrating outstanding overall writing quality."
    };


    // Show selected feedback
    feedback.innerHTML = `
        <div class="feedback-item">
            <strong>Score: ${score}/10</strong>
            <p>${feedbackMessages[score]}</p>
        </div>
    `;
}



// Clear Essay
function clearEssay() {

    // Clear textarea
    document.getElementById("essay").value = "";
    const fileInp = document.getElementById("fileInput"); if (fileInp) fileInp.value = "";
    const nameDisp = document.getElementById("fileNameDisplay"); if (nameDisp) nameDisp.innerText = "No document selected";


    // Reset word count
    document.getElementById("wordCount").innerText = "0";


    // Reset character count
    document.getElementById("charCount").innerText = "0";


    // Reset score
    document.getElementById("score").innerText = "--";


    // Reset result words
    document.getElementById("resultWords").innerText = "0";


    // Reset sentences
    document.getElementById("sentences").innerText = "0";


    // Reset vocabulary
    document.getElementById("vocabulary").innerText = "--";


    // Reset feedback
    document.getElementById("feedback").innerHTML = `
        <p>
            Submit your essay to receive personalized feedback.
        </p>
    `;
}
// Handle File Upload (PDF, DOCX, TXT)
async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const fileNameDisplay = document.getElementById("fileNameDisplay");
    fileNameDisplay.innerText = "Reading " + file.name + "...";

    const name = file.name.toLowerCase();

    // Plain text or markdown direct browser reading
    if (name.endsWith(".txt") || name.endsWith(".md")) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById("essay").value = e.target.result;
            updateWordCount();
            fileNameDisplay.innerText = "Loaded: " + file.name;
        };
        reader.readAsText(file);
        return;
    }

    // PDF, DOCX or other formats via backend API
    try {
        const formData = new FormData();
        formData.append("file", file);

        let resp = null;
        for (const port of [8080, 8000]) {
            try {
                resp = await fetch(`http://127.0.0.1:${port}/api/upload-file`, {
                    method: "POST",
                    body: formData
                });
                if (resp && resp.ok) break;
            } catch (err) {
                // try next
            }
        }

        if (resp && resp.ok) {
            const data = await resp.json();
            document.getElementById("essay").value = data.text;
            updateWordCount();
            fileNameDisplay.innerText = `Loaded: ${file.name} (${data.word_count} words)`;
        } else {
            const errJson = resp ? await resp.json().catch(() => null) : null;
            alert(errJson && errJson.detail ? errJson.detail : "Failed to extract text from file. Please ensure the backend is running.");
            fileNameDisplay.innerText = "Error loading " + file.name;
        }
    } catch (err) {
        alert("Error uploading file: " + err.message);
        fileNameDisplay.innerText = "Error loading " + file.name;
    }
}
