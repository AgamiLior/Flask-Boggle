class BoggleGame {

    constructor(board, secs = 60) {
        this.secs = secs
        this.words = new Set();
        this.board = $("#" + board);
        this.score = 0;
        this.showTimer();

        this.timer = setInterval(this.clock.bind(this), 1000);

        $(".add-word", this.board).on("submit", this.submit.bind(this));
    }

    showWord(word) {
        $(".words", this.board).append($("<li>", { text: word }));
    }

    showMsg(msg, cls) {
        $(".msg", this.board)
            .text(msg)
            .removeClass()
            .addClass(`msg ${cls}`);
    }

    async submit(e) {
        e.preventDefault();
        const $word = $(".word", this.board)

        let word = $word.val()
        let len = word.length
        if (len < 2) {
            this.showMsg(`Word has to be at least 2 letters long`);
            return;
        }

        if (!word) return;

        if (this.words.has(word)) {
            this.showMsg(`Already found ${word}`);
            return;
        }

        const resp = await axios.get("/check-word", { params: { word: word } });
        if (resp.data.result === "not-word") {
            this.showMsg(`${word} is not a valid English word`, "err");
        } else if (resp.data.result === "not-on-board") {
            this.showMsg(`${word} is not a valid word on this board`, "err");
        } else {
            this.showWord(word);
            this.score += word.length;
            this.showScore();
            this.words.add(word);
            this.showMsg(`Word added: ${word}`, "ok");
        }
        $word.val("").focus();

    }

    showScore() {
        $(".score", this.board).text(this.score);
    }

    showTimer() {
        $(".timer", this.board).text(this.secs);
    }

    async clock() {
        this.secs -= 1;
        this.showTimer();

        if (this.secs === 10) {
            $('.timer').css("color", "red")
        }
        if (this.secs === 0) {
            clearInterval(this.timer);
            await this.gameEnds();
        }
    }

    async gameEnds() {
        $(".add-word", this.board).hide();
        const res = await axios.post("/end-game", { score: this.score });
        if (res) {
            this.showMsg(`Final score: ${this.score}`, "ok");
        }
        return;
    }
}

