(function() {
  const subscribeBtn = document.getElementById('subscribeBtn');
  let isSubscribed = false;

  subscribeBtn.addEventListener('click', function() {
    isSubscribed = !isSubscribed;
    if (isSubscribed) {
      subscribeBtn.classList.remove('bg-brand-500', 'hover:bg-brand-600', 'shadow-brand-200');
      subscribeBtn.classList.add('bg-emerald-500', 'hover:bg-emerald-600', 'shadow-emerald-200');
      subscribeBtn.innerHTML = '<i class="fas fa-check-circle"></i> <span>Subscribed</span>';
    } else {
      subscribeBtn.classList.remove('bg-emerald-500', 'hover:bg-emerald-600', 'shadow-emerald-200');
      subscribeBtn.classList.add('bg-brand-500', 'hover:bg-brand-600', 'shadow-brand-200');
      subscribeBtn.innerHTML = '<i class="fas fa-user-plus"></i> <span>Subscribe</span>';
    }
  });
})();

(function() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const blogCards = document.querySelectorAll('.blog-card');

  function setActiveButton(activeBtn) {
    filterButtons.forEach(btn => {
      btn.classList.remove('bg-brand-500', 'text-white', 'shadow-sm');
      btn.classList.add('bg-gray-100', 'hover:bg-gray-200', 'text-gray-700');
    });
    activeBtn.classList.remove('bg-gray-100', 'hover:bg-gray-200', 'text-gray-700');
    activeBtn.classList.add('bg-brand-500', 'text-white', 'shadow-sm');
  }

  function filterCards(filter) {
    blogCards.forEach(card => {
      const category = card.getAttribute('data-category');
      if (filter === 'all' || category === filter) {
        card.classList.remove('hidden-card');
      } else {
        card.classList.add('hidden-card');
      }
    });
  }

  filterButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');
      setActiveButton(this);
      filterCards(filter);
    });
  });
})();

(function() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = mobileMenu.querySelectorAll('a');
  const mobileIcon = mobileMenuBtn.querySelector('i');

  mobileMenuBtn.addEventListener('click', function() {
    mobileMenu.classList.toggle('hidden');
    if (mobileMenu.classList.contains('hidden')) {
      mobileIcon.classList.remove('fa-times');
      mobileIcon.classList.add('fa-bars');
    } else {
      mobileIcon.classList.remove('fa-bars');
      mobileIcon.classList.add('fa-times');
    }
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', function() {
      mobileMenu.classList.add('hidden');
      mobileIcon.classList.remove('fa-times');
      mobileIcon.classList.add('fa-bars');
    });
  });
})();

(function() {
  const searchBtn = document.getElementById('searchBtn');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchPanel = document.getElementById('searchPanel');
  const searchInput = document.getElementById('searchInput');
  const closeSearch = document.getElementById('closeSearch');
  const searchResults = document.getElementById('searchResults');
  const searchEmpty = document.getElementById('searchEmpty');
  const resultCount = document.getElementById('resultCount');
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');

  const articles = [];
  document.querySelectorAll('.blog-card').forEach(card => {
    const title = card.getAttribute('data-title');
    const desc = card.getAttribute('data-desc');
    const category = card.getAttribute('data-category');
    const img = card.querySelector('img').getAttribute('src');
    const date = card.getAttribute('data-date');
    const id = card.getAttribute('data-id');
    articles.push({ title, desc, category, img, date, id });
  });

  function renderResults(list) {
    if (list.length === 0) {
      searchResults.innerHTML = '';
      searchEmpty.classList.remove('hidden');
      resultCount.textContent = '0 articles';
      return;
    }
    searchEmpty.classList.add('hidden');
    resultCount.textContent = list.length + (list.length === 1 ? ' article' : ' articles');
    searchResults.innerHTML = list.map(article => `
      <li class="search-item rounded-2xl mx-2 my-1">
        <a href="#articles" data-search-id="${article.id}" class="flex items-center gap-3 p-3 rounded-2xl">
          <img src="${article.img}" alt="${article.title}" class="w-12 h-12 rounded-xl object-cover flex-shrink-0">
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-gray-800 truncate">${article.title}</p>
            <p class="text-xs text-gray-500 truncate">${article.desc}</p>
          </div>
          <span class="text-[10px] font-semibold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-1 rounded-full flex-shrink-0">${article.category}</span>
        </a>
      </li>
    `).join('');
  }

  function openSearch() {
    searchOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    searchInput.value = '';
    renderResults(articles);
    setTimeout(() => searchInput.focus(), 50);
  }

  function closeSearchPanel(showMsg) {
    searchOverlay.classList.add('hidden');
    document.body.style.overflow = '';
    if (showMsg) {
      showToast('Search closed — clicked away from the website');
    }
  }

  function showToast(message) {
    toastMsg.textContent = message;
    toast.classList.remove('hidden');
    toast.classList.add('flex');
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => {
      toast.classList.add('hidden');
      toast.classList.remove('flex');
    }, 2500);
  }

  window.__showToast = showToast;

  searchBtn.addEventListener('click', openSearch);

  closeSearch.addEventListener('click', function() {
    closeSearchPanel(true);
  });

  searchOverlay.addEventListener('click', function(e) {
    if (!searchPanel.contains(e.target)) {
      closeSearchPanel(true);
    }
  });

  searchInput.addEventListener('input', function() {
    const query = this.value.trim().toLowerCase();
    if (query === '') {
      renderResults(articles);
      return;
    }
    const filtered = articles.filter(a =>
      a.title.toLowerCase().includes(query) ||
      a.desc.toLowerCase().includes(query) ||
      a.category.toLowerCase().includes(query)
    );
    renderResults(filtered);
  });

  searchResults.addEventListener('click', function(e) {
    const link = e.target.closest('a[data-search-id]');
    if (link) {
      e.preventDefault();
      const id = link.getAttribute('data-search-id');
      closeSearchPanel(false);
      setTimeout(() => {
        if (window.__openArticle) window.__openArticle(id);
      }, 200);
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !searchOverlay.classList.contains('hidden')) {
      closeSearchPanel(true);
    }
  });
})();

(function() {
  const STORAGE_KEY = 'blogfolio_saved_articles';

  function getSaved() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function setSaved(arr) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  }

  function updateBookmarkCount() {
    const saved = getSaved();
    const countEl = document.getElementById('bookmarkCount');
    countEl.textContent = saved.length;
    if (saved.length === 0) {
      countEl.classList.add('hidden');
    } else {
      countEl.classList.remove('hidden');
    }
  }

  function updateSaveButton(btn, isSaved) {
    const icon = btn.querySelector('i');
    if (isSaved) {
      btn.classList.add('bookmark-active');
      icon.classList.remove('far');
      icon.classList.add('fas');
      btn.setAttribute('title', 'Saved');
    } else {
      btn.classList.remove('bookmark-active');
      icon.classList.remove('fas');
      icon.classList.add('far');
      btn.setAttribute('title', 'Save');
    }
  }

  function refreshAllSaveButtons() {
    const saved = getSaved();
    document.querySelectorAll('.save-btn').forEach(btn => {
      const id = btn.getAttribute('data-save-id');
      updateSaveButton(btn, saved.includes(id));
    });
  }

  function toggleSave(id) {
    let saved = getSaved();
    const idx = saved.indexOf(id);
    let nowSaved;
    if (idx > -1) {
      saved.splice(idx, 1);
      nowSaved = false;
    } else {
      saved.push(id);
      nowSaved = true;
    }
    setSaved(saved);
    updateBookmarkCount();
    refreshAllSaveButtons();
    return nowSaved;
  }

  window.__toggleSave = toggleSave;
  window.__getSaved = getSaved;
  window.__refreshAllSaveButtons = refreshAllSaveButtons;

  document.addEventListener('click', function(e) {
    const btn = e.target.closest('.save-btn');
    if (!btn) return;
    e.stopPropagation();
    e.preventDefault();
    const id = btn.getAttribute('data-save-id');
    const nowSaved = toggleSave(id);
    if (window.__showToast) {
      window.__showToast(nowSaved ? 'Article saved' : 'Article removed from saved');
    }
  });

  document.getElementById('bookmarkBtn').addEventListener('click', function() {
    const saved = getSaved();
    if (saved.length === 0) {
      if (window.__showToast) window.__showToast('No saved articles yet');
    } else {
      if (window.__showToast) window.__showToast('You have ' + saved.length + ' saved article' + (saved.length === 1 ? '' : 's'));
    }
  });

  updateBookmarkCount();
  refreshAllSaveButtons();
})();

(function() {
  const articleOverlay = document.getElementById('articleOverlay');
  const articleModal = document.getElementById('articleModal');
  const closeArticle = document.getElementById('closeArticle');
  const modalCloseBottom = document.getElementById('modalCloseBottom');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalCategory = document.getElementById('modalCategory');
  const modalDate = document.getElementById('modalDate');
  const modalRead = document.getElementById('modalRead');
  const modalAuthor = document.getElementById('modalAuthor');
  const modalBody = document.getElementById('modalBody');
  const modalSaveBtn = document.getElementById('modalSaveBtn');
  const modalSaveBtnBottom = document.getElementById('modalSaveBtnBottom');

  let currentArticleId = null;

  const bodyTemplates = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
    "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.",
    "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.",
    "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus."
  ];

  function updateModalSaveState() {
    if (!currentArticleId) return;
    const saved = window.__getSaved ? window.__getSaved() : [];
    const isSaved = saved.includes(currentArticleId);
    [modalSaveBtn, modalSaveBtnBottom].forEach(btn => {
      const icon = btn.querySelector('i');
      const label = btn.querySelector('span');
      if (isSaved) {
        btn.classList.add('bookmark-active');
        icon.classList.remove('far');
        icon.classList.add('fas');
        if (label) label.textContent = 'Saved';
      } else {
        btn.classList.remove('bookmark-active');
        icon.classList.remove('fas');
        icon.classList.add('far');
        if (label) label.textContent = label.textContent.includes('Save article') ? 'Save article' : 'Save';
      }
    });
  }

  function openArticle(id) {
    const card = document.querySelector('.blog-card[data-id="' + id + '"]');
    if (!card) return;
    currentArticleId = id;

    modalImg.src = card.querySelector('img').getAttribute('src');
    modalImg.alt = card.getAttribute('data-title');
    modalTitle.textContent = card.getAttribute('data-title');
    modalCategory.textContent = card.querySelector('.absolute.top-4.left-4').textContent.trim();
    modalDate.textContent = card.getAttribute('data-date');
    modalRead.textContent = card.getAttribute('data-read');
    modalAuthor.textContent = card.getAttribute('data-author');

    const idx = (parseInt(id) - 1) % bodyTemplates.length;
    modalBody.innerHTML = `
      <p>${bodyTemplates[idx]}</p>
      <p>${bodyTemplates[(idx + 1) % bodyTemplates.length]}</p>
      <p>${bodyTemplates[(idx + 2) % bodyTemplates.length]}</p>
    `;

    updateModalSaveState();

    articleOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    articleModal.scrollTop = 0;
  }

  function closeArticleModal() {
    articleOverlay.classList.add('hidden');
    document.body.style.overflow = '';
    currentArticleId = null;
  }

  window.__openArticle = openArticle;

  document.querySelectorAll('.blog-card').forEach(card => {
    card.addEventListener('click', function(e) {
      if (e.target.closest('.save-btn')) return;
      const id = this.getAttribute('data-id');
      openArticle(id);
    });
  });

  closeArticle.addEventListener('click', closeArticleModal);
  modalCloseBottom.addEventListener('click', closeArticleModal);

  articleOverlay.addEventListener('click', function(e) {
    if (!articleModal.contains(e.target)) {
      closeArticleModal();
    }
  });

  [modalSaveBtn, modalSaveBtnBottom].forEach(btn => {
    btn.addEventListener('click', function() {
      if (!currentArticleId) return;
      const nowSaved = window.__toggleSave(currentArticleId);
      updateModalSaveState();
      if (window.__showToast) {
        window.__showToast(nowSaved ? 'Article saved' : 'Article removed from saved');
      }
    });
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !articleOverlay.classList.contains('hidden')) {
      closeArticleModal();
    }
  });
})();