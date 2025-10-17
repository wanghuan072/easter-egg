<template>
  <div class="home-view">
    <!-- Header Component -->
    <Header />

    <!-- Error State -->
    <div v-if="store.errors.home" class="error-banner">
      <p>⚠️ {{ store.errors.home }}</p>
      <button @click="retryFetch" class="retry-button">{{ $t('common.retry') }}</button>
    </div>

    <!-- Hero Section -->
    <section class="hero-section">
      <!-- Tech Background Elements -->
      <!-- 简化的背景装饰元素 -->
      <div class="hero-decorations">
        <div class="tech-circle tech-circle-1"></div>
        <div class="tech-circle tech-circle-2"></div>
        <div class="tech-circle tech-circle-3"></div>
      </div>

      <!-- Main Content -->
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">
              <span class="hero-title-part-1">{{ $t('HomePage.hero.title1') }}</span>
              <br />
              <span class="hero-title-part-2">{{ $t('HomePage.hero.title2') }}</span>
            </h1>

            <p class="hero-description">
              {{ $t('HomePage.hero.desc') }}
            </p>

            <div class="hero-search">
              <div class="hero-search-container">
                <div class="hero-search-icon">🔍</div>
                <input
                  v-model="searchQuery"
                  @keyup.enter="performSearch"
                  type="text"
                  :placeholder="$t('HomePage.hero.searchPlaceholder')"
                  class="hero-search-input"
                />
              </div>
              <button @click="performSearch" class="hero-search-button">
                <span v-if="isSearching">{{ $t('HomePage.hero.searching') }}</span>
                <span v-else>{{ $t('HomePage.hero.searchBtn') }}</span>
              </button>
            </div>

            <div class="hero-stats">
              <div class="stat-item">
                <div class="stat-dot stat-dot-purple"></div>
                <span>{{ $t('HomePage.hero.stat1') }}</span>
              </div>
              <div class="stat-item">
                <div class="stat-dot stat-dot-cyan"></div>
                <span>{{ $t('HomePage.hero.stat2') }}</span>
              </div>
              <div class="stat-item">
                <div class="stat-dot stat-dot-purple"></div>
                <span>{{ $t('HomePage.hero.stat3') }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Scroll Indicator positioned outside hero-content -->
        <div class="scroll-indicator">
          <div class="scroll-arrow">
            <div class="scroll-dot"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Latest Discoveries Section -->
    <section class="latest-discoveries-section">
      <div class="container">
        <!-- PC横幅广告位1 -->
        <aside style="width: 100%; padding: 20px 0; text-align: center; overflow: hidden;" v-if="!isMobile">
          <ins class="eas6a97888e2" data-zoneid="5751770"></ins>
        </aside>

        <!-- PC底部粘性横幅广告位1 -->
        <ins class="eas6a97888e17" data-zoneid="5751774" v-if="!isMobile"></ins>

        <!-- PC左侧粘性横幅广告位1  -->
        <ins class="eas6a97888e17" data-zoneid="5751776" v-if="!isMobile"></ins>

        <!-- PC粘性横幅广告位2 -->
        <ins class="eas6a97888e17" data-zoneid="5751778" v-if="!isMobile"></ins>

        <!-- 移动横幅广告1 -->
        <aside style="width: 100%; padding: 20px 0; text-align: center; overflow: hidden;" v-if="isMobile">
          <ins class="eas6a97888e2" data-zoneid="5751802"></ins>
        </aside>

        <div class="section-header">
          <h2 class="section-title"><span class="gradient-text">{{ $t('HomePage.section1.title1') }}</span> {{ $t('HomePage.section1.title2') }}</h2>
          <p class="section-description">
            {{ $t('HomePage.section1.desc') }}
          </p>
        </div>
        <div v-if="!isLatestDiscoveriesLoaded" class="loading-section">
          <div class="loading-text">{{ $t('common.loading') }}</div>
        </div>
        
        <MediaList 
          v-else
          type="latest"
          :data="latestDiscoveries"
          :show-more-button="true"
        />
      </div>
    </section>

    <!-- Video Games Section -->
    <section class="category-section">
      <div class="container">
        <!-- PC横幅广告位2 -->
        <aside style="width: 100%; padding: 20px 0; text-align: center; overflow: hidden;" v-if="!isMobile">
          <ins class="eas6a97888e2" data-zoneid="5751772"></ins>
        </aside>

        <div class="section-header">
          <h2 class="section-title"><span class="gradient-text">{{ $t('HomePage.section2.title1') }} {{ $t('HomePage.section2.title2') }}</span></h2>
          <p class="section-description">
            {{ $t('HomePage.section2.desc') }}
          </p>
        </div>
          <div v-if="!isGamesLoaded" class="loading-section">
          <div class="loading-spinner"></div>
          <p>{{ $t('VideoGamesPage.loadingGames') }}</p>
        </div>
        
        <div v-else-if="store.errors.home" class="error-section">
          <p>⚠️ {{ store.errors.home }}</p>
          <button @click="retryFetch" class="retry-button">{{ $t('common.retry') }}</button>
        </div>
        
        <MediaList 
          v-else
          type="games"
          :data="games"
          :show-more-button="true"
        />
      </div>
    </section>

    <!-- Movies Section -->
    <section class="category-section">
      <div class="container">
        <!-- 原生广告 -->
        <aside style="width: 100%; padding: 20px 0; text-align: center; overflow: hidden;">
          <ins class="eas6a97888e20" data-zoneid="5751798"></ins>
        </aside>

        <div class="section-header">
          <h2 class="section-title"><span class="gradient-text">{{ $t('HomePage.section3.title1') }} {{ $t('HomePage.section3.title2') }}</span></h2>
          <p class="section-description">
            {{ $t('HomePage.section3.desc') }}
          </p>
        </div>
        <div v-if="!isMoviesLoaded" class="loading-section">
          <div class="loading-spinner"></div>
          <p>{{ $t('MoviesPage.loadingMovies') }}</p>
        </div>
        
        <div v-else-if="store.errors.home" class="error-section">
          <p>⚠️ {{ store.errors.home }}</p>
          <button @click="retryFetch" class="retry-button">{{ $t('common.retry') }}</button>
        </div>
        
        <MediaList 
          v-else
          type="movies"
          :data="movies"
          :show-more-button="true"
        />
      </div>
    </section>

    <!-- TV Shows Section -->
    <section class="category-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title"><span class="gradient-text">{{ $t('HomePage.section4.title1') }} {{ $t('HomePage.section4.title2') }}</span></h2>
          <p class="section-description">
            {{ $t('HomePage.section4.desc') }}
          </p>
        </div>
        <div v-if="!isTVLoaded" class="loading-section">
          <div class="loading-spinner"></div>
          <p>{{ $t('TVShowsPage.loadingShows') }}</p>
        </div>
        
        <div v-else-if="store.errors.home" class="error-section">
          <p>⚠️ {{ store.errors.home }}</p>
          <button @click="retryFetch" class="retry-button">{{ $t('common.retry') }}</button>
        </div>
        
        <MediaList 
          v-else
          type="tv"
          :data="tvShows"
          :show-more-button="true"
        />
      </div>
    </section>

    <!-- Introduction Section -->
    <section class="introduction-section">
      <div class="container">
        <div class="introduction-content">
          <div class="section-header">
            <h2 class="section-title">{{ $t('HomePage.section5.title1') }} <span class="gradient-text">{{ $t('HomePage.section5.title2') }}</span></h2>
            <p class="section-description">
              {{ $t('HomePage.section5.desc') }}
            </p>
          </div>

          <div class="introduction-grid">
            <div class="intro-card">
              <div class="intro-icon">
                <svg t="1757063170726" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2287" width="200" height="200"><path d="M1009.2544 537.2928 1009.2544 434.8928c0-162.9184-114.176-198.9632-187.2896-198.9632L541.9008 235.9296c0.4096-1.536 0.7168-3.2768 0.7168-4.9152l0-65.8432c0-10.3424-8.3968-18.7392-18.7392-18.7392-10.3424 0-18.7392 8.3968-18.7392 18.7392l0 65.8432c0 1.7408 0.2048 3.3792 0.7168 4.9152l-3.8912 0L210.2272 235.9296c-73.1136 0-187.2896 36.0448-187.2896 198.9632l0 102.5024 0 29.9008 0 163.4304c0 59.5968 48.3328 107.9296 107.9296 107.9296 17.408 0 34.816 0 52.1216 0 0 0 58.1632 3.6864 86.016-27.5456 16.5888-18.6368 25.1904-31.8464 25.1904-31.8464 20.5824-27.7504 50.176-41.984 83.968-46.592 7.3728-1.024 14.9504-1.6384 22.4256-1.9456l76.0832 0 129.6384 0c7.4752 0.3072 40.1408 0.9216 47.616 1.9456 33.792 4.608 63.3856 18.8416 83.968 46.592 0 0 8.704 13.2096 25.1904 31.8464 27.8528 31.3344 86.016 27.5456 86.016 27.5456 17.408 0 34.816 0 52.1216 0 59.5968 0 107.9296-48.3328 107.9296-107.9296L1009.152 567.1936 1009.2544 537.2928zM401.2032 510.5664l-114.176 0.3072L286.72 625.2544c0 10.3424-8.3968 18.7392-18.7392 18.7392l0 0c-10.3424 0-18.7392-8.3968-18.7392-18.7392l0.2048-114.2784-114.0736 0.3072 0 0c-10.3424 0-18.7392-8.3968-18.7392-18.7392 0-10.3424 8.2944-18.7392 18.7392-18.7392l114.2784-0.3072 0.2048-114.4832c0-10.3424 8.3968-18.7392 18.7392-18.7392l0 0c10.3424 0 18.7392 8.3968 18.7392 18.7392l-0.2048 114.3808 114.0736-0.3072 0 0c10.3424 0 18.7392 8.3968 18.7392 18.7392C419.9424 502.0672 411.5456 510.464 401.2032 510.5664zM688.2304 488.1408c-31.232 0-56.6272-25.3952-56.6272-56.6272 0-31.232 25.3952-56.5248 56.6272-56.5248s56.6272 25.3952 56.6272 56.5248C744.7552 462.7456 719.4624 488.1408 688.2304 488.1408zM834.56 621.2608c-32.256 0-58.4704-26.2144-58.4704-58.368 0-32.256 26.2144-58.4704 58.4704-58.4704 32.256 0 58.4704 26.2144 58.4704 58.4704C893.0304 595.0464 866.816 621.2608 834.56 621.2608z" fill="#FF9000" p-id="2288"></path></svg>
              </div>
              <h3 class="intro-title">{{ $t('HomePage.section5.card1Title') }}</h3>
              <p class="intro-description">
                {{ $t('HomePage.section5.card1Desc') }}
              </p>
            </div>

            <div class="intro-card">
              <div class="intro-icon">
                <svg t="1757063279384" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3484" width="200" height="200"><path d="M97.28 512c0 225.792 172.544 408.576 386.048 408.576s386.048-182.784 386.048-408.576S696.32 103.424 483.328 103.424C269.824 103.424 97.28 286.208 97.28 512z" fill="#3366FF" p-id="3485"></path><path d="M502.272 838.656h385.536c21.504 0 38.912 18.432 38.912 40.96s-17.408 40.96-38.912 40.96H502.272c-21.504 0-38.912-18.432-38.912-40.96 0.512-22.528 17.408-40.96 38.912-40.96z" fill="#3366FF" p-id="3486"></path><path d="M386.56 307.712c0 56.32 43.008 101.888 96.256 101.888s96.256-45.568 96.256-101.888-43.008-101.888-96.256-101.888c-53.248-0.512-96.256 45.568-96.256 101.888zM483.328 613.888c53.248 0 96.256 45.568 96.256 101.888s-43.008 101.888-96.256 101.888-96.256-45.568-96.256-101.888 42.496-101.888 96.256-101.888z" fill="#FFFFFF" p-id="3487"></path><path d="M270.848 409.6c53.248 0 96.768 45.568 96.768 101.888s-43.008 102.4-96.256 102.4S174.592 568.32 174.592 512c0-56.32 43.008-101.888 96.256-102.4zM695.296 409.6c53.248 0 96.256 45.568 96.256 101.888s-43.008 101.888-96.256 101.888S599.04 568.32 599.04 512s43.008-102.4 96.256-102.4z" fill="#AEC9FF" p-id="3488"></path></svg>
              </div>
              <h3 class="intro-title">{{ $t('HomePage.section5.card2Title') }}</h3>
              <p class="intro-description">
                {{ $t('HomePage.section5.card2Desc') }}
              </p>
            </div>

            <div class="intro-card">
              <div class="intro-icon">
                <svg t="1757063304052" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5035" width="200" height="200"><path d="M929.28 250.368h-310.784c-3.584 0-6.656-2.048-8.192-5.632-1.024-3.584 0-6.656 3.072-8.704l150.528-100.864c14.336-9.216 19.456-27.648 11.264-42.496-4.608-8.192-12.288-13.824-20.48-15.872-9.216-2.048-18.432-0.512-25.6 4.608L547.84 203.264c-22.016 14.848-50.176 14.848-72.192 0L294.912 81.92c-14.848-9.728-34.816-5.632-45.056 9.216-0.512 0.512-0.512 1.024-1.024 1.536-7.68 14.848-2.048 33.28 11.264 42.496l150.016 100.864c3.584 2.048 4.608 7.68 2.048 10.752-1.536 2.048-4.096 3.584-6.656 3.584H94.72c-34.816 0-63.488 28.16-64 63.488v570.88c0 34.816 29.184 63.488 64 63.488h834.048c34.816 0 63.488-28.16 64-63.488V313.856c0.512-35.84-28.672-63.488-63.488-63.488z m-321.024 539.136c0 17.92-14.848 32.256-32.768 32.256H190.976c-17.92 0-32.256-14.336-32.256-32.256V409.088c0-17.92 14.336-32.256 32.256-32.256h385.024c17.92 0 32.256 14.336 32.256 32.256v380.416z m240.64 31.232H752.64c-17.92 0.512-32.768-12.8-33.28-30.208-0.512-17.92 12.8-32.768 30.208-33.28H848.896c17.92-0.512 32.768 12.8 33.28 30.208 0.512 17.92-12.8 32.768-30.208 33.28h-3.072z m0-142.336H752.64c-17.92 0.512-32.768-12.8-33.28-30.208-0.512-17.92 12.8-32.768 30.208-33.28H848.896c17.92-0.512 32.768 12.8 33.28 30.208s-12.8 32.768-30.208 33.28h-3.072z m-48.128-142.848c-43.52-0.512-78.336-36.864-77.824-80.384s36.864-78.336 80.384-77.824c43.52 0.512 77.824 36.352 77.824 78.848 0 44.032-36.352 79.872-80.384 79.36z" fill="#3366FF" p-id="5036"></path><path d="M513.536 442.368H256c-17.92-0.512-32.256 13.824-32.768 31.744v251.904c0.512 17.92 14.848 31.744 32.768 31.744h258.048c17.92 0 32.256-13.824 32.256-31.744V473.6c-0.512-17.408-14.848-31.232-32.768-31.232z" fill="#AEC9FF" p-id="5037"></path></svg>
              </div>
              <h3 class="intro-title">{{ $t('HomePage.section5.card3Title') }}</h3>
              <p class="intro-description">
                {{ $t('HomePage.section5.card3Desc') }}
              </p>
            </div>

            <div class="intro-card">
              <div class="intro-icon">
                <svg t="1757063319258" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6061" width="200" height="200"><path d="M209.7 414.1l202.4 53.8c2 0.5 4.1 0.8 6.3 0.8 11 0 20.6-7.4 23.4-18 3.4-12.9-4.3-26.2-17.2-29.6l-202.4-53.8c-6.2-1.7-12.7-0.9-18.3 2.3-5.7 3.2-9.7 8.5-11.4 14.8-3.4 13 4.3 26.3 17.2 29.7zM424.7 606.3l-202.4-53.8c-6.2-1.7-12.7-0.8-18.4 2.4-5.6 3.3-9.7 8.5-11.3 14.8-3.4 12.9 4.3 26.2 17.2 29.6l202.4 53.8c2 0.5 4.1 0.8 6.3 0.8 11 0 20.6-7.4 23.4-18 3.4-12.8-4.3-26.1-17.2-29.6zM607.9 468.7c2.2 0 4.3-0.3 6.2-0.8l202.5-53.8c12.9-3.4 20.6-16.7 17.2-29.7-1.7-6.3-5.8-11.6-11.5-14.9-5.6-3.2-12.1-4-18.2-2.3L601.6 421c-12.9 3.4-20.6 16.7-17.2 29.7 2.9 10.6 12.5 18 23.5 18zM833.8 569.7c-1.7-6.3-5.7-11.6-11.4-14.8-5.6-3.2-12.1-4.1-18.3-2.4l-202.5 53.8c-12.9 3.4-20.6 16.7-17.2 29.6 2.8 10.6 12.4 18 23.4 18 2.2 0 4.3-0.3 6.2-0.8l202.5-53.8c13-3.4 20.7-16.7 17.3-29.6z" fill="#FF4E7D" p-id="6062"></path><path d="M891.3 166.2c-6.8-5.3-18.6-10.7-36.3-6.4L518.7 244h-0.1c-0.4 0.1-0.8 0.1-1.1 0L171 159.8c-17.6-4.4-29.4 1-36.2 6.4-7.5 5.8-16.3 17.4-16.3 39.7l0.6 342.4 0.2 186.1c0 14.2 5.8 25.8 17.2 34.6 8.5 6.6 18 9.6 22.5 11.1l340 98.4c4.6 1.3 9.4 2 14.1 2 4.7 0 9.5-0.7 14.2-2l340.1-98.4 0.2-0.1c4.4-1.4 13.7-4.4 22.2-11 11.4-8.8 17.1-20.4 17.1-34.5l0.8-528.5c-0.1-22.4-9-34-16.4-39.8zM488.8 825l-315.5-91.3c-2.7-0.9-4.5-1.6-5.6-2.1l-0.2-183.2-0.6-339.6L488.8 287v538z m369.5-93.4c-1 0.5-2.7 1.2-5.2 2L537.2 825V289.3l321.9-80.6-0.8 522.9z" fill="#4E30DC" p-id="6063"></path></svg>
              </div>
              <h3 class="intro-title">{{ $t('HomePage.section5.card4Title') }}</h3>
              <p class="intro-description">
                {{ $t('HomePage.section5.card4Desc') }}
              </p>
            </div>

            <div class="intro-card">
              <div class="intro-icon">
                <svg t="1757063343331" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7093" width="200" height="200"><path d="M910.793765 204.556811l-329.178854-188.093059c-38.335401-21.919657-100.798424-21.983656-139.229823 0l-329.178854 188.093059c-38.335401 21.919657-69.630911 75.742816-69.630911 120.062123l0 374.746141c0 44.351307 31.167513 98.110466 69.630911 120.062123l329.178854 188.093059c38.335401 21.919657 100.798424 21.983656 139.229823 0l329.178854-188.093059c38.335401-21.919657 69.630911-75.742816 69.630911-120.062123l0-374.746141c0-44.319307-31.167513-98.110466-69.630911-120.062123zM769.675972 466.152721l-82.238714 81.822721c-17.087733 17.023734-27.743566 50.55921-23.711629 74.558834l19.391697 115.582193c4.031937 23.999625-9.951844 34.367463-31.039515 23.03964l-101.662411-54.591147c-21.11967-11.327823-55.67913-11.327823-76.7668 0l-101.662411 54.591147c-21.11967 11.359822-35.103451 0.991984-31.039515-23.03964l19.391697-115.582193c4.031937-23.999625-6.655896-57.5671-23.743629-74.558834l-82.238714-81.822721c-17.087733-17.023734-11.743816-33.791472 11.871814-37.311417l113.662223-16.863736c23.615631-3.519945 51.551194-24.255621 62.111029-46.07928l50.847205-105.150356c10.559835-21.855658 27.839565-21.855658 38.3994 0l50.815206 105.150356c10.559835 21.855658 38.527398 42.591334 62.111029 46.07928l113.630224 16.863736c23.583631 3.487945 28.927548 20.287683 11.839815 37.311417z" fill="#F8CA2A" p-id="7094"></path></svg>
              </div>
              <h3 class="intro-title">{{ $t('HomePage.section5.card5Title') }}</h3>
              <p class="intro-description">
                {{ $t('HomePage.section5.card5Desc') }}
              </p>
            </div>

            <div class="intro-card">
              <div class="intro-icon">
                <svg t="1757063372050" class="icon" viewBox="0 0 1056 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9883" width="200" height="200"><path d="M16 0m512 0l0 0q512 0 512 512l0 0q0 512-512 512l0 0q-512 0-512-512l0 0q0-512 512-512Z" fill="#7C9FEE" p-id="9884"></path><path d="M686.016 758.944h-316c-18.72 0-33.856-12.384-33.856-27.68V251.616c0-15.232 15.136-27.616 33.856-27.616h316c18.688 0 33.824 12.384 33.824 27.68v479.616c0 15.232-15.136 27.648-33.824 27.648z m-157.888-27.52c12.48 0 22.592-8.896 22.592-19.872 0-10.944-10.144-19.84-22.592-19.84-12.48 0-22.592 8.896-22.592 19.84 0 10.976 10.112 19.84 22.592 19.84z m157.888-452.096h-316v387.392h316.032V279.328z" fill="#FFFFFF" p-id="9885"></path><path d="M422.496 339.104h191.84a19.2 19.2 0 0 1 0 38.4h-191.84a19.2 19.2 0 0 1 0-38.4z m0 76.736h108.128a19.2 19.2 0 1 1 0 38.4h-108.16a19.2 19.2 0 0 1 0-38.4z m0 76.736h45.344a19.2 19.2 0 0 1 0 38.4h-45.344a19.2 19.2 0 0 1 0-38.4z" fill="#FFFFFF" p-id="9886"></path></svg>
              </div>
              <h3 class="intro-title">{{ $t('HomePage.section5.card6Title') }}</h3>
              <p class="intro-description">
                {{ $t('HomePage.section5.card6Desc') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq-section">
      <div class="container">
        <!-- 移动横幅广告2 -->
        <aside style="width: 100%; padding: 20px 0; text-align: center; overflow: hidden;" v-if="isMobile">
          <ins class="eas6a97888e10" data-zoneid="5751804"></ins>
        </aside>

        <div class="faq-content">
          <div class="section-header">
            <h2 class="section-title">
              {{ $t('HomePage.section6.title1') }} <span class="gradient-text">{{ $t('HomePage.section6.title2') }}</span>
            </h2>
            <p class="section-description">
              {{ $t('HomePage.section6.desc') }}
            </p>
          </div>

          <div class="faq-grid">
            <div class="faq-item">
              <h3 class="faq-title">{{ $t('HomePage.section6.q1') }}</h3>
              <p class="faq-answer">
                {{ $t('HomePage.section6.a1') }}
              </p>
            </div>

            <div class="faq-item">
              <h3 class="faq-title">{{ $t('HomePage.section6.q2') }}</h3>
              <p class="faq-answer">
                {{ $t('HomePage.section6.a2') }}
              </p>
            </div>

            <div class="faq-item">
              <h3 class="faq-title">{{ $t('HomePage.section6.q3') }}</h3>
              <p class="faq-answer">
                {{ $t('HomePage.section6.a3') }}
              </p>
            </div>

            <div class="faq-item">
              <h3 class="faq-title">{{ $t('HomePage.section6.q4') }}</h3>
              <p class="faq-answer">
                {{ $t('HomePage.section6.a4') }}
              </p>
            </div>

            <div class="faq-item">
              <h3 class="faq-title">{{ $t('HomePage.section6.q5') }}</h3>
              <p class="faq-answer">
                {{ $t('HomePage.section6.a5') }}
              </p>
            </div>

            <div class="faq-item">
              <h3 class="faq-title">{{ $t('HomePage.section6.q6') }}</h3>
              <p class="faq-answer">
                {{ $t('HomePage.section6.a6') }}
              </p>
            </div>

            <div class="faq-item">
              <h3 class="faq-title">{{ $t('HomePage.section6.q7') }}</h3>
              <p class="faq-answer">
                {{ $t('HomePage.section6.a7') }}
              </p>
            </div>

            <div class="faq-item">
              <h3 class="faq-title">{{ $t('HomePage.section6.q8') }}</h3>
              <p class="faq-answer">
                {{ $t('HomePage.section6.a8') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer Component -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import MediaList from '@/components/MediaList.vue'

import { useEasterEggsStore } from '@/stores/easterEggs.js'

import { useDeviceDetection } from '@/utils/useDeviceDetection.js'
const { isMobile } = useDeviceDetection()

// 使用路由
const router = useRouter()
const { locale } = useI18n()

const store = useEasterEggsStore()
const searchQuery = ref('')
const isSearching = ref(false)

// 使用store中的数据
const games = computed(() => store.games)
const movies = computed(() => store.movies)
const tvShows = computed(() => store.tvShows)
const latestDiscoveries = computed(() => store.latestDiscoveries)
const isLoading = computed(() => store.isLoading.home)

// 数据加载状态计算属性
const isLatestDiscoveriesLoaded = computed(() => store.isDataLoaded('latestDiscoveries'))
const isGamesLoaded = computed(() => store.isDataLoaded('games'))
const isMoviesLoaded = computed(() => store.isDataLoaded('movies'))
const isTVLoaded = computed(() => store.isDataLoaded('tv'))

// 搜索功能
const performSearch = async () => {
  if (!searchQuery.value.trim()) return
  isSearching.value = true
  try {
    // 根据当前语言构建路由名称
    const currentLang = locale.value
    const routeName = currentLang === 'en' 
      ? 'Search' 
      : `Search${currentLang.charAt(0).toUpperCase() + currentLang.slice(1)}`
    
    // 直接跳转到搜索结果页面，数据由 SearchResultsView.vue 负责获取
    router.push({
      name: routeName,
      query: { q: searchQuery.value.trim() }
    })
  } catch (error) {
    console.error('Search failed:', error)
  } finally {
    isSearching.value = false
  }
}

// 重试获取数据
const retryFetch = async () => {
  await store.fetchHomeData()
}

// 重试获取最新发现
const retryLatestFetch = async () => {
  await store.fetchLatestDiscoveries()
}

// 广告联盟
const adProvider = () => {
  const script = document.createElement('script')
    script.src = 'https://a.magsrv.com/ad-provider.js'
    script.async = true
    script.type = 'application/javascript'
    document.head.appendChild(script)

    script.onload = () => {
        if (window.AdProvider) {
            window.AdProvider.push({ "serve": {} })
        }
    }
}

onMounted(async () => {
  // 等待数据预加载完成
  const waitForData = () => {
    if (store.areDataTypesLoaded(['games', 'movies', 'tv'])) {
      // 数据已加载，获取最新发现（不限制数量）
      store.fetchLatestDiscoveries()
    } else {
      // 使用更短的轮询间隔，提高响应速度
      setTimeout(waitForData, 50)
    }
  }
  
  waitForData()

  // 加载广告
  setTimeout(() => {
    adProvider()
  }, 1000); // 延迟1秒加载广
})
</script>

<style scoped>
.home-view {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: #f5f5f5;
  background-color: #100e19;
}

/* 通用样式 */
.section-header {
  text-align: center;
  margin-bottom: 48px;
}

.section-title {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
  line-height: 1.2;
}

.section-title .gradient-text {
  background: linear-gradient(90deg, #8b5cf6, #06b6d4);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 15px rgba(139, 92, 246, 0.3));
}

.section-description {
  font-size: 20px;
  color: #a0a0a0;
  max-width: 600px;
  margin: 0 auto;
}

.gradient-text {
  background: linear-gradient(90deg, #a855f7, #06b6d4);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.action-button {
  padding: 12px 32px;
  background-color: #374151;
  color: #e5e7eb;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-button:hover {
  background-color: #4b5563;
  transform: scale(1.05);
}


/* Hero Section */
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-image: url('/images/hero-bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* 背景遮罩层 */
.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(16, 14, 25, 0.7);
  z-index: 0;
}

/* 网格图案层 */
.hero-section::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(139, 92, 246, 0.2) 1px, transparent 1px),
    linear-gradient(90deg, rgba(139, 92, 246, 0.2) 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.6;
  z-index: 1;
}

/* 简化的装饰元素容器 */
.hero-decorations {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  pointer-events: none;
}

.tech-circle {
  position: absolute;
  border-radius: 50%;
  border: 2px solid rgba(139, 92, 246, 0.3);
}

.tech-circle-1 {
  width: 400px;
  height: 400px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-color: rgba(139, 92, 246, 0.2);
  box-shadow: 0 0 40px rgba(139, 92, 246, 0.1);
}

.tech-circle-2 {
  width: 300px;
  height: 300px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-color: rgba(6, 182, 212, 0.2);
  box-shadow: 0 0 30px rgba(6, 182, 212, 0.1);
}

.tech-circle-3 {
  width: 200px;
  height: 200px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-color: rgba(139, 92, 246, 0.4);
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.2);
}

/* 移除不再需要的网格和线条样式 */



/* 移除不再需要的扫描动画 */

/* 移除重复的背景层级 */

.hero-content {
  position: relative;
  z-index: 10;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
  animation: fade-in 0.8s ease-out;
  width: 100%;
}

.hero-title {
  font-size: 96px;
  font-weight: 700;
  margin-bottom: 24px;
  line-height: 1.1;
}

.hero-title-part-1 {
  background: linear-gradient(90deg, #06b6d4, #0891b2);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 20px rgba(6, 182, 212, 0.4));
}

.hero-title-part-2 {
  color: #f5f5f5;
  background: linear-gradient(90deg, #8b5cf6, #06b6d4);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 25px rgba(139, 92, 246, 0.5));
}

/* Removed hero-subtitle as it's replaced by hero-title-part-2 */

.hero-description {
  font-size: 24px;
  color: #a0a0a0;
  margin-bottom: 32px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-search {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  max-width: 600px;
  margin: 0 auto 48px;
  animation: fade-in 1s ease-out 0.2s both;
}

@media (min-width: 640px) {
  .hero-search {
    flex-direction: row;
    align-items: stretch;
  }

  .hero-search-container {
    flex: 1;
    margin-bottom: 0;
  }

  .hero-search-button {
    flex-shrink: 0;
  }
}

.hero-search-container {
  position: relative;
  width: 100%;
  margin-bottom: 8px;
}

.hero-search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  font-size: 20px;
}

.hero-search-input {
  width: 100%;
  padding: 16px 16px 16px 48px;
  background-color: rgba(30, 41, 59, 0.9);
  backdrop-filter: blur(8px);
  border: 1px solid #334155;
  border-radius: 8px;
  color: #f5f5f5;
  font-size: 18px;
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
  transition: all 0.3s ease;
}

.hero-search-input:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 30px rgba(139, 92, 246, 0.6);
  transform: scale(1.02);
}

.hero-search-button {
  padding: 16px 32px;
  background: linear-gradient(90deg, #8b5cf6, #06b6d4);
  color: #000;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 18px;
  cursor: pointer;
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
  transition: all 0.3s ease;
  animation: glow-pulse 2s ease-in-out infinite;
}

.hero-search-button:hover {
  background: linear-gradient(90deg, #7c3aed, #0891b2);
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(139, 92, 246, 0.6);
}

.hero-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  font-size: 14px;
  color: #a0a0a0;
  animation: fade-in 1.2s ease-out 0.4s both;
  flex-wrap: wrap;
}

@media (max-width: 640px) {
  .hero-stats {
    gap: 16px;
  }
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: rgba(30, 41, 59, 0.3);
  border-radius: 20px;
  border: 1px solid rgba(139, 92, 246, 0.2);
  backdrop-filter: blur(8px);
}

.stat-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.stat-dot-purple {
  background-color: #8b5cf6;
  box-shadow: 0 0 10px rgba(139, 92, 246, 0.6);
}

.stat-dot-cyan {
  background-color: #06b6d4;
  box-shadow: 0 0 10px rgba(6, 182, 212, 0.6);
}

.scroll-indicator {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  animation: float 3s ease-in-out infinite;
  z-index: 10;
  pointer-events: none;
}

@media (max-width: 768px) {
  .scroll-indicator {
    bottom: 20px;
  }
}

@media (max-width: 480px) {
  .scroll-indicator {
    bottom: 16px;
  }

  .scroll-arrow {
    width: 20px;
    height: 32px;
  }

  .scroll-dot {
    width: 3px;
    height: 10px;
  }
}

.scroll-arrow {
  width: 24px;
  height: 40px;
  border: 2px solid #8b5cf6;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  padding-top: 8px;
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
  background-color: rgba(30, 41, 59, 0.2);
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

.scroll-arrow:hover {
  border-color: #06b6d4;
  box-shadow: 0 0 25px rgba(6, 182, 212, 0.4);
  transform: scale(1.1);
}

.scroll-dot {
  width: 4px;
  height: 12px;
  background-color: #8b5cf6;
  border-radius: 2px;
  animation: scroll-pulse 2s infinite;
  box-shadow: 0 0 8px rgba(139, 92, 246, 0.8);
}

@keyframes scroll-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateX(-50%) translateY(0px);
  }
  50% {
    transform: translateX(-50%) translateY(-8px);
  }
}

@keyframes fade-in {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}





/* Latest Discoveries Section */
.latest-discoveries-section {
  padding: 80px 0;
  background-color: #0f172a;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  margin-bottom: 48px;
}

.article-card {
  background-color: #1e293b;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #334155;
}

.article-card:hover {
  transform: scale(1.02);
  border-color: #8b5cf6;
  box-shadow: 0 12px 40px rgba(139, 92, 246, 0.2);
}

.article-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.article-card:hover .article-image img {
  transform: scale(1.1);
}

.article-image::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
}

.article-category {
  position: absolute;
  top: 16px;
  left: 16px;
  padding: 4px 12px;
  background: linear-gradient(90deg, #8b5cf6, #06b6d4);
  color: #000;
  font-size: 12px;
  font-weight: 600;
  border-radius: 20px;
  z-index: 1;
  box-shadow: 0 0 10px rgba(139, 92, 246, 0.4);
}

.article-content {
  padding: 24px;
}

.article-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 12px;
  line-height: 1.4;
  transition: color 0.2s ease;
}

.article-card:hover .article-title {
  color: #8b5cf6;
  text-shadow: 0 0 8px rgba(139, 92, 246, 0.4);
}

.article-excerpt {
  color: #a0a0a0;
  margin-bottom: 16px;
  line-height: 1.6;
  display: -webkit-box;
  line-clamp: 3;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #6b7280;
}

.section-action {
  text-align: center;
}

/* Category Sections */
.category-section {
  padding: 80px 0;
}

.category-section:nth-child(odd) {
  background-color: #100e19;
}

.category-section:nth-child(even) {
  background-color: #0f172a;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  margin-bottom: 48px;
}

.category-article-card {
  background-color: #1e293b;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #334155;
}

.category-article-card:hover {
  transform: scale(1.02);
  border-color: #8b5cf6;
  box-shadow: 0 12px 40px rgba(139, 92, 246, 0.2);
}

.category-article-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.category-article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.category-article-card:hover .category-article-image img {
  transform: scale(1.1);
}

.category-article-image::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
}

.category-article-category {
  position: absolute;
  top: 16px;
  left: 16px;
  padding: 4px 12px;
  background: linear-gradient(90deg, #8b5cf6, #06b6d4);
  color: #000;
  font-size: 12px;
  font-weight: 600;
  border-radius: 20px;
  z-index: 1;
  box-shadow: 0 0 10px rgba(139, 92, 246, 0.4);
}

.category-article-content {
  padding: 24px;
}

.category-article-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 12px;
  line-height: 1.4;
  transition: color 0.2s ease;
}

.category-article-card:hover .category-article-title {
  color: #8b5cf6;
  text-shadow: 0 0 8px rgba(139, 92, 246, 0.4);
}

.category-article-excerpt {
  color: #a0a0a0;
  margin-bottom: 16px;
  line-height: 1.6;
  display: -webkit-box;
  line-clamp: 3;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.category-article-meta {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #6b7280;
}



/* Introduction Section */
.introduction-section {
  padding: 80px 0;
  background-color: #100e19;
}

.introduction-content {
  text-align: center;
}

.introduction-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
  margin-top: 48px;
}

@keyframes glow-pulse {
  0%,
  100% {
    box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(139, 92, 246, 0.6);
  }
}

.intro-card {
  background-color: #1e293b;
  border-radius: 16px;
  padding: 32px 24px;
  border: 1px solid #334155;
  transition: all 0.3s ease;
  cursor: pointer;
}

.intro-card:hover {
  transform: translateY(-8px);
  border-color: #8b5cf6;
  box-shadow: 0 12px 40px rgba(139, 92, 246, 0.2);
}

.intro-icon {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.intro-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #f5f5f5;
}

.intro-description {
  color: #a0a0a0;
  line-height: 1.6;
  font-size: 16px;
}

/* FAQ Section */
.faq-section {
  padding: 80px 0;
  background-color: #0f172a;
}

.faq-content {
  max-width: 100%;
  margin: 0 auto;
}

.faq-grid {
  margin-top: 48px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 24px;
}

.faq-item {
  background-color: #1e293b;
  border-radius: 12px;
  border: 1px solid #334155;
  padding: 24px;
  transition: all 0.3s ease;
}

.faq-item:hover {
  border-color: #8b5cf6;
  box-shadow: 0 8px 32px rgba(139, 92, 246, 0.1);
  transform: translateY(-2px);
}

.faq-title {
  font-size: 18px;
  font-weight: 600;
  color: #f5f5f5;
  margin: 0 0 16px 0;
  background: linear-gradient(135deg, #8b5cf6, #06b6d4);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.faq-answer {
  color: #a0a0a0;
  line-height: 1.6;
  margin: 0;
}

/* Loading and Error States */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(16, 14, 25, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  color: #f5f5f5;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #334155;
  border-top: 4px solid #8b5cf6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

.error-banner {
  background: linear-gradient(90deg, #dc2626, #b91c1c);
  color: white;
  padding: 16px 24px;
  margin: 20px 0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
}

.error-section {
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid #dc2626;
  color: #fca5a5;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  margin: 20px 0;
}

.retry-button {
  background: #dc2626;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.retry-button:hover {
  background: #b91c1c;
  transform: scale(1.05);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 响应式设计 - 1024px 断点 */
@media (max-width: 1024px) {
  .section-title {
    font-size: 40px;
  }
  
  .section-description {
    font-size: 18px;
  }
  
  .hero-title {
    font-size: 72px;
  }
  
  .hero-description {
    font-size: 20px;
    margin-bottom: 28px;
  }
  
  .hero-search-input {
    font-size: 16px;
    padding: 14px 14px 14px 44px;
  }
  
  .hero-search-button {
    font-size: 16px;
    padding: 14px 28px;
  }
  
  .hero-stats {
    font-size: 16px;
    gap: 28px;
  }
  
  .latest-discoveries-section,
  .category-section,
  .introduction-section,
  .faq-section {
    padding: 60px 0;
  }
  
  .section-header {
    margin-bottom: 40px;
  }
  
  .articles-grid,
  .category-grid {
    gap: 28px;
    margin-bottom: 40px;
  }
  
  .introduction-grid {
    gap: 20px;
    margin-top: 20px;
  }
  
  .faq-grid {
    margin-top: 40px;
    gap: 20px;
  }
  
  .intro-card {
    padding: 28px 20px;
  }
  
  .intro-icon {
    width: 25px;
    height: 25px;
    margin: 0 auto 10px;
  }
  
  .intro-title {
    font-size: 18px;
    margin-bottom: 14px;
  }
  
  .intro-description {
    font-size: 16px;
  }
  
  .faq-item {
    padding: 20px;
  }
  
  .faq-title {
    font-size: 16px;
    margin-bottom: 14px;
  }
  
  .faq-answer {
    font-size: 16px;
  }
}

/* 响应式设计 - 768px 断点 (移动端) */
@media (max-width: 768px) {
  .hero-section {
    min-height: 80vh;
    padding: 20px 0;
  }
  
  .hero-content {
    padding: 0 10px;
  }
  
  .section-title {
    font-size: 24px;
  }
  
  .section-description {
    font-size: 12px;
  }
  
  .hero-title {
    font-size: 32px;
    margin-bottom: 10px;
  }
  
  .hero-description {
    font-size: 12px;
    margin-bottom: 20px;
  }
  
  .hero-search {
    margin-bottom: 20px;
  }
  
  .hero-search-input {
    font-size: 12px;
    padding: 10px 10px 10px 36px;
  }
  
  .hero-search-icon {
    font-size: 16px;
    left: 12px;
  }
  
  .hero-search-button {
    font-size: 12px;
    padding: 10px 20px;
  }
  
  .hero-stats {
    font-size: 12px;
    gap: 10px;
  }
  
  .stat-item {
    padding: 6px 12px;
    gap: 6px;
  }
  
  .latest-discoveries-section,
  .category-section,
  .introduction-section,
  .faq-section {
    padding: 20px 0;
  }
  
  .section-header {
    margin-bottom: 20px;
  }
  
  .section-title {
    margin-bottom: 10px;
  }
  
  .section-description {
    margin-bottom: 10px;
  }
  
  .articles-grid,
  .category-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-bottom: 20px;
  }
  
  .article-card,
  .category-article-card {
    margin-bottom: 10px;
  }
  
  .article-content,
  .category-article-content {
    padding: 20px;
  }
  
  .article-title,
  .category-article-title {
    font-size: 16px;
    margin-bottom: 10px;
  }
  
  .article-excerpt,
  .category-article-excerpt {
    font-size: 12px;
    margin-bottom: 10px;
  }
  
  .article-meta,
  .category-article-meta {
    font-size: 12px;
  }
  
  .article-category,
  .category-article-category {
    font-size: 10px;
    padding: 3px 8px;
    top: 12px;
    left: 12px;
  }
  
  .introduction-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin-top: 20px;
  }
  
  .intro-card {
    padding: 20px 16px;
  }
  
  
  .intro-title {
    font-size: 16px;
    margin-bottom: 10px;
  }
  
  .intro-description {
    font-size: 12px;
  }
  
  .faq-grid {
    grid-template-columns: 1fr;
    margin-top: 20px;
    gap: 20px;
  }
  
  .faq-item {
    padding: 20px;
  }
  
  .faq-title {
    font-size: 16px;
    margin-bottom: 10px;
  }
  
  .faq-answer {
    font-size: 12px;
  }
  
  .loading-section {
    padding: 20px 10px;
    margin: 10px 0;
  }
  
  .loading-text {
    font-size: 12px;
  }
  
  .loading-spinner {
    width: 40px;
    height: 40px;
    margin-bottom: 15px;
  }
  
  .error-banner {
    padding: 12px 20px;
    margin: 10px 0;
  }
  
  .error-section {
    padding: 15px;
    margin: 10px 0;
  }
  
  .retry-button {
    padding: 6px 12px;
    font-size: 12px;
  }
  
  .action-button {
    padding: 10px 24px;
    font-size: 12px;
  }
  
  .tech-circle-1 {
    width: 300px;
    height: 300px;
  }
  
  .tech-circle-2 {
    width: 200px;
    height: 200px;
  }
  
  .tech-circle-3 {
    width: 150px;
    height: 150px;
  }
}

</style>