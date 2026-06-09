
    const tutorialsKey = 'howToDoTutorials';
    const pageSize = 5;
    let currentPage = 1;
    let tutorials = [];
    let searchTerm = '';
    let filteredTutorials = [];

    const elements = {
      tutorialSection: document.getElementById('tutorialSection'),
      addSection: document.getElementById('addSection'),
      tutorialList: document.getElementById('tutorialList'),
      prevPage: document.getElementById('prevPage'),
      nextPage: document.getElementById('nextPage'),
      topicInput: document.getElementById('topicInput'),
      categoryInput: document.getElementById('categoryInput'),
      descriptionInput: document.getElementById('descriptionInput'),
      saveButton: document.getElementById('saveButton'),
      clearButton: document.getElementById('clearButton'),
      statusMessage: document.getElementById('statusMessage'),
      menuTutorials: document.getElementById('menu-tutorials'),
      menuAdd: document.getElementById('menu-add'),
      menuExport: document.getElementById('menu-export'),
      menuImport: document.getElementById('menu-import'),
      importInput: document.getElementById('importInput'),
      searchInput: document.getElementById('searchInput'),
      clearSearchBtn: document.getElementById('clearSearchBtn'),
      searchInfo: document.getElementById('searchInfo'),
    };

    function loadTutorials() {
      const saved = localStorage.getItem(tutorialsKey);
      tutorials = saved ? JSON.parse(saved) : [];
      filteredTutorials = [...tutorials];
    }

    function saveTutorials() {
      localStorage.setItem(tutorialsKey, JSON.stringify(tutorials));
    }

    function showStatus(message, time = 2500) {
      elements.statusMessage.textContent = message;
      if (time > 0) {
        setTimeout(() => {
          elements.statusMessage.textContent = '';
        }, time);
      }
    }

    function copyToClipboard(text, button) {
      navigator.clipboard.writeText(text).then(() => {
        const originalText = button.textContent;
        button.textContent = '✓';
        button.classList.add('copied');
        setTimeout(() => {
          button.textContent = originalText;
          button.classList.remove('copied');
        }, 1500);
      }).catch(() => {
        showStatus('Failed to copy to clipboard.', 2000);
      });
    }

    function applySearch() {
      searchTerm = elements.searchInput.value.trim().toLowerCase();
      if (searchTerm === '') {
        filteredTutorials = [...tutorials];
        elements.searchInfo.textContent = '';
      } else {
        filteredTutorials = tutorials.filter(item => 
          item.topic.toLowerCase().includes(searchTerm) ||
          item.description.toLowerCase().includes(searchTerm) ||
          item.category.toLowerCase().includes(searchTerm)
        );
        elements.searchInfo.textContent = `Found ${filteredTutorials.length} result(s)`;
      }
      currentPage = 1;
      renderTutorials();
    }

    function renderTutorials() {
      const start = (currentPage - 1) * pageSize;
      const pageItems = filteredTutorials.slice(start, start + pageSize);
      elements.tutorialList.innerHTML = '';

      if (pageItems.length === 0) {
        elements.tutorialList.innerHTML = '<p>No tutorials found. Add a tutorial to get started.</p>';
      } else {
        pageItems.forEach(item => {
          const card = document.createElement('div');
          card.className = 'tutorial-item';
          
          const heading = document.createElement('h3');
          heading.textContent = escapeHtml(item.topic);
          card.appendChild(heading);

          const descriptionLines = item.description.split('\n').filter(line => line.trim() !== '');
          const descriptionDiv = document.createElement('div');
          descriptionDiv.className = 'description-lines';

          descriptionLines.forEach(line => {
            const lineWrapper = document.createElement('div');
            lineWrapper.className = 'line-wrapper';
            
            const lineText = document.createElement('div');
            lineText.className = 'line-text';
            lineText.textContent = escapeHtml(line);
            
            const copyBtn = document.createElement('button');
            copyBtn.className = 'line-copy-btn';
            copyBtn.textContent = 'Copy';
            copyBtn.addEventListener('click', () => copyToClipboard(line, copyBtn));
            
            lineWrapper.appendChild(lineText);
            lineWrapper.appendChild(copyBtn);
            descriptionDiv.appendChild(lineWrapper);
          });

          card.appendChild(descriptionDiv);

          const meta = document.createElement('div');
          meta.className = 'meta';
          meta.textContent = `Category: ${escapeHtml(item.category)} • Added: ${escapeHtml(item.date)}`;
          card.appendChild(meta);

          elements.tutorialList.appendChild(card);
        });
      }

      elements.prevPage.disabled = currentPage === 1;
      elements.nextPage.disabled = start + pageSize >= filteredTutorials.length;
    }

    function escapeHtml(text) {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    function switchView(view) {
      elements.menuTutorials.classList.remove('active');
      elements.menuAdd.classList.remove('active');
      elements.menuExport.classList.remove('active');
      elements.menuImport.classList.remove('active');

      if (view === 'tutorials') {
        elements.tutorialSection.style.display = 'block';
        elements.addSection.style.display = 'none';
        elements.menuTutorials.classList.add('active');
      } else if (view === 'add') {
        elements.tutorialSection.style.display = 'none';
        elements.addSection.style.display = 'block';
        elements.menuAdd.classList.add('active');
      } else if (view === 'export') {
        exportToXml();
        elements.menuExport.classList.add('active');
      } else if (view === 'import') {
        elements.importInput.click();
        elements.menuImport.classList.add('active');
      }
    }

    function addTutorial() {
      const topic = elements.topicInput.value.trim();
      const category = elements.categoryInput.value;
      const description = elements.descriptionInput.value.trim();

      if (!topic || !description) {
        showStatus('Topic and description are required.', 4000);
        return;
      }

      tutorials.unshift({
        topic,
        category,
        description,
        date: new Date().toLocaleDateString(),
      });

      saveTutorials();
      elements.searchInput.value = '';
      searchTerm = '';
      filteredTutorials = [...tutorials];
      currentPage = 1;
      renderTutorials();
      switchView('tutorials');
      clearForm();
      showStatus('Tutorial saved locally. Use Export to create an XML file.');
    }

    function clearForm() {
      elements.topicInput.value = '';
      elements.categoryInput.value = 'General';
      elements.descriptionInput.value = '';
    }

    function exportToXml() {
      const xmlDoc = document.implementation.createDocument('', '', null);
      const root = xmlDoc.createElement('tutorials');

      tutorials.forEach(item => {
        const tutorialNode = xmlDoc.createElement('tutorial');
        const topicNode = xmlDoc.createElement('topic');
        topicNode.textContent = item.topic;
        const categoryNode = xmlDoc.createElement('category');
        categoryNode.textContent = item.category;
        const descriptionNode = xmlDoc.createElement('description');
        descriptionNode.textContent = item.description;
        const dateNode = xmlDoc.createElement('date');
        dateNode.textContent = item.date;

        tutorialNode.appendChild(topicNode);
        tutorialNode.appendChild(categoryNode);
        tutorialNode.appendChild(descriptionNode);
        tutorialNode.appendChild(dateNode);
        root.appendChild(tutorialNode);
      });

      xmlDoc.appendChild(root);
      const serializer = new XMLSerializer();
      const xmlString = serializer.serializeToString(xmlDoc);
      const blob = new Blob([xmlString], { type: 'application/xml' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'how-to-do-tutorials.xml';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showStatus('XML file generated. Save it locally for reuse.');
    }

    function importXmlFile(file) {
      const reader = new FileReader();
      reader.onload = function () {
        const parser = new DOMParser();
        const xml = parser.parseFromString(reader.result, 'application/xml');
        const tutorialsNodes = xml.querySelectorAll('tutorial');
        const imported = [];

        tutorialsNodes.forEach(node => {
          const topic = node.querySelector('topic')?.textContent?.trim() || '';
          const category = node.querySelector('category')?.textContent?.trim() || 'General';
          const description = node.querySelector('description')?.textContent?.trim() || '';
          const date = node.querySelector('date')?.textContent?.trim() || new Date().toLocaleDateString();

          if (topic && description) {
            imported.push({ topic, category, description, date });
          }
        });

        if (imported.length > 0) {
          tutorials = imported.concat(tutorials);
          saveTutorials();
          elements.searchInput.value = '';
          searchTerm = '';
          filteredTutorials = [...tutorials];
          currentPage = 1;
          renderTutorials();
          switchView('tutorials');
          showStatus(`${imported.length} tutorials imported successfully.`);
        } else {
          showStatus('No valid tutorials found in XML.', 4000);
        }
      };
      reader.readAsText(file);
    }

    elements.prevPage.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage -= 1;
        renderTutorials();
      }
    });

    elements.nextPage.addEventListener('click', () => {
      if ((currentPage * pageSize) < filteredTutorials.length) {
        currentPage += 1;
        renderTutorials();
      }
    });

    elements.searchInput.addEventListener('input', applySearch);
    elements.clearSearchBtn.addEventListener('click', () => {
      elements.searchInput.value = '';
      applySearch();
    });

    elements.saveButton.addEventListener('click', addTutorial);
    elements.clearButton.addEventListener('click', clearForm);
    elements.menuTutorials.addEventListener('click', () => switchView('tutorials'));
    elements.menuAdd.addEventListener('click', () => switchView('add'));
    elements.menuExport.addEventListener('click', () => switchView('export'));
    elements.menuImport.addEventListener('click', () => switchView('import'));

    elements.importInput.addEventListener('change', event => {
      const file = event.target.files[0];
      if (file) {
        importXmlFile(file);
      }
      event.target.value = '';
    });

    loadTutorials();
    renderTutorials();
