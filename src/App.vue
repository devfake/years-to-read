<template>
  <div id="app">
    <app-modal :userWordsPerMinute.sync="userWordsPerMinute"></app-modal>
    <nav>
      <a @click="showSpeedModal()">Change your reading speed</a>
      <a target="_blank" href="https://github.com/devfake/years-to-read">Github</a>
    </nav>
    <div class="search-wrap">
      <div class="search-input">
        <i class="icon-search"></i>
        <input placeholder="Search reading time for a book..." v-model="bookSearch" @keyup="search()">
      </div>
      <i class="icon-loading" v-show="isLoading"></i>
      <div class="result-wrap" v-if="hasSearched">
        <span v-if="!results.length" class="nothing-found">Nothing found :(</span>
        <div class="result" v-for="result in results">
          <span class="cover" :style="{backgroundImage: `url(${result.thumbnail || '/img/no-cover.png'}`}"></span>
          <span class="title">{{ result.title }}</span>
          <span class="time">will probably take {{ timeToRead }} to read</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import http from 'axios'
  import debounce from 'debounce'
  
  import AppModal from './Modal'
  
  const SEARCH_TIME_MS = 400
  const AVERAGE_WORDS_PER_PAGE = 280
  const DEFAULT_TIME = 60
  
  export default {
    data() {
      return {
        userWordsPerMinute: 250,
        bookSearch: '',
        latestSearch: '',
        isLoading: false,
        hasSearched: false,
        results: [],
        timeToRead: '',
      }
    },

    mounted() {
      this.search = debounce(this.search, SEARCH_TIME_MS)
      this.setUserWordsPerMinute()
    },
    
    methods: {
      setUserWordsPerMinute() {
        if( ! localStorage.getItem('wpm')) {
          localStorage.setItem('wpm', this.userWordsPerMinute.toString())
        }

        this.userWordsPerMinute = +localStorage.getItem('wpm')
      },
      
      calculateReadingTime(pages) {
        if(pages) {
          const words = pages * AVERAGE_WORDS_PER_PAGE
          const userWordsPerSecond = this.userWordsPerMinute / DEFAULT_TIME
          const secondsForBook = words / userWordsPerSecond

          // https://stackoverflow.com/a/25279340/4237070
          const date = new Date(null)
          date.setSeconds(secondsForBook)
          const result = date.toISOString().substr(11, 5)

          const [hours, minutes] = result.split(':')
          
          this.timeToRead = `${this.removeLeadingZero(hours)} hours and ${this.removeLeadingZero(minutes)} minutes`
        }
      },
      
      removeLeadingZero(time) {
        return time.replace(/^0+/, '') || 0
      },
      
      search() {
        const bookSearch = this.bookSearch.trim()
        
        if(bookSearch && bookSearch !== this.latestSearch) {
          this.hasSearched = false
          this.isLoading = true
          this.latestSearch = bookSearch
          
          http.get(`/api?q=${this.bookSearch}`)
            .then(({data}) => {
              this.hasSearched = true

              if(data.status === 404) {
                this.results = []
              } else {
                this.results = data
                this.calculateReadingTime(data[0].pages)
              }
              
              this.isLoading = false
            }) 
        }
        
        if(!bookSearch) {
          this.latestSearch = ''
          this.hasSearched = false
          this.results = []
        }
      },
      
      showSpeedModal() {
        this.$modal.show('speed')
      }
    },
    
    components: {
      AppModal
    }
  }
</script>

<style lang="scss">
  @import "sass/normalize";
  @import "sass/base";
  @import "sass/modal";
  @import "sass/search";
  @import "sass/nav";
</style>
