<template>
  <modal name="speed" width="920px" height="80%" :adaptive="true" @closed="resetCounter">
    <div class="modal-inner">
      
      <span class="modal-headline">
        Find your reading speed in words per minute (WPM) using this text. Try to read this the way you usually read a book. Your WPM will be saved for future searches (Current: {{ userWordsPerMinute }}).
      </span>
      
      <button class="action-btn" @click="startTimer()" v-if="!timerStarted"><i class="icon-play"></i>START TIMER</button>
      <button class="action-btn" @click="endTimer()" v-if="timerStarted"><i class="icon-play"></i>STOP AND CALCULATE</button>
      
      <p class="sample-text" v-if="timeCalculated">Your new WPM is: {{ userWordsPerMinute }}. You can try it again!</p>
      
      <p class="sample-text" v-if="timerStarted">
        And he looked over at the alarm clock, ticking on the chest of drawers. “God in Heaven!” he thought. It was half past six and the hands were quietly moving forwards, it was even later than half past, more like quarter to seven. Had the alarm clock not rung? He could see from the bed that it had been set for four o’clock as it should have been; it certainly must have rung. Yes, but was it possible to quietly sleep through that furniture-rattling noise? True, he had not slept peacefully, but probably all the more deeply because of that. What should he do now? The next train went at seven; if he were to catch that he would have to rush like mad and the collection of samples was still not packed, and he did not at all feel particularly fresh and lively. And even if he did catch the train he would not avoid his boss’s anger as the office assistant would have been there to see the five o’clock train go, he would have put in his report about Gregor’s not being there a long time ago.
        <br><br>
        The office assistant was the boss’s man, spineless, and with no understanding. What about if he reported sick? But that would be extremely strained and suspicious as in fifteen years of service Gregor had never once yet been ill. His boss would certainly come round with the doctor from the medical insurance company, accuse his parents of having a lazy son, and accept the doctor’s recommendation not to make any claim as the doctor believed that no-one was ever ill but that many were workshy. And what’s more, would he have been entirely wrong in this case? Gregor did in fact, apart from excessive sleepiness after sleeping for so long, feel completely well and even felt much hungrier than usual.
      </p>
      
      <button class="action-btn" v-if="timerStarted" @click="endTimer()"><i class="icon-play"></i>STOP AND CALCULATE</button>
      
    </div>
  </modal>
</template>

<script>
  const WORDS_IN_SAMPLE = 310
  const DEFAULT_TIME = 60
  const SECOND_IN_MS = 1000

  export default {
    props: {
      userWordsPerMinute: Number
    },
    
    data() {
      return {
        timeCalculated: false,
        interval: null,
        timerStarted: false,
        timer: 0
      }
    },
    
    methods: {
      startTimer() {
        this.timer = 0
        this.timeCalculated = false

        this.interval = setInterval(() => this.timer++, SECOND_IN_MS)

        this.timerStarted = true
      },

      endTimer() {
        this.resetCounter()
        this.timeCalculated = true

        const userWordsPerMinute = Math.ceil(WORDS_IN_SAMPLE * DEFAULT_TIME / this.timer)

        this.$emit('update:userWordsPerMinute', userWordsPerMinute)
        
        localStorage.setItem('wpm', userWordsPerMinute.toString())
      },

      resetCounter() {
        clearInterval(this.interval)

        this.timerStarted = false
        this.timeCalculated = false
      },
    }
  }
</script>
