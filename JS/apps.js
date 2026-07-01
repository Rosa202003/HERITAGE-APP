// // Dataset mapping perfectly to the images and attributes in the screenshot
// const buildings = [
//   {
//     id: 1,
//     title: "German Administrative Boma",
//     era: "German",
//     condition: "Good",
//     grade: "Grade I Listed",
//     location: "City Centre",
//     year: 1891,
//     image: "../ASSETS/images/oldboma.png", 
//     has360: true,
//     area: "740 m²",
//     description: "Late German colonial building overseeing the commercial harbour. Raised veranda, louvred shutters, and raised ground floor for coastal flooding.",
//     significance: "Documents the evolution of Dar es Salaam as a major East African port.",
//     architect: "Unknown",
//     ownership: "Tanzania Ports Authority",
//     style: "German Colonial Administrative",
//     inspected: "2023-11-08"
//   },
//   {
//     id: 2,
//     title: "St. Joseph Metropolitan Cathedral",
//     era: "German",
//     condition: "Excellent",
//     grade: "Grade I Listed",
//     location: "City Centre",
//     year: 1898,
//     image: "../ASSETS/images/stjosephcathedral.png",
//     area: "740 m²",
//     description: "Late German colonial building overseeing the commercial harbour. Raised veranda, louvred shutters, and raised ground floor for coastal flooding.",
//     significance: "Documents the evolution of Dar es Salaam as a major East African port.",
//     architect: "Unknown",
//     ownership: "Tanzania Ports Authority",
//     style: "German Colonial Administrative",
//     inspected: "2023-11-08"
//   },
//   {
//     id: 3,
//     title: "Azania Front Lutheran Church",
//     era: "German",
//     condition: "Good",
//     grade: "Grade I Listed",
//     location: "Kivukoni",
//     year: 1898,
//     image: "../ASSETS/images/azaniafront.png",
//     has360: true,
//     area: "740 m²",
//     description: "Late German colonial building overseeing the commercial harbour. Raised veranda, louvred shutters, and raised ground floor for coastal flooding.",
//     significance: "Documents the evolution of Dar es Salaam as a major East African port.",
//     architect: "Unknown",
//     ownership: "Tanzania Ports Authority",
//     style: "German Colonial Administrative",
//     inspected: "2023-11-08"
//   },
//   {
//     id: 4,
//     title: "Old Harbour Master's Office",
//     era: "German",
//     condition: "Fair",
//     grade: "Grade II Listed",
//     location: "Kivukoni",
//     year: 1915,
//     image: "../ASSETS/images/harbordsm.png",
//     has360: false,
//     area: "740 m²",
//     description: "Late German colonial building overseeing the commercial harbour. Raised veranda, louvred shutters, and raised ground floor for coastal flooding.",
//     significance: "Documents the evolution of Dar es Salaam as a major East African port.",
//     architect: "Unknown",
//     ownership: "Tanzania Ports Authority",
//     style: "German Colonial Administrative",
//     inspected: "2023-11-08"
//   },
//   {
//     id: 5,
//     title: "General Post Office",
//     era: "British",
//     condition: "Poor",
//     grade: "Grade II Listed",
//     location: "City Centre",
//     year: 1913,
//     image: "../ASSETS/images/postayazamani.png",
//     has360: false,
//     area: "740 m²",
//     description: "Late German colonial building overseeing the commercial harbour. Raised veranda, louvred shutters, and raised ground floor for coastal flooding.",
//     significance: "Documents the evolution of Dar es Salaam as a major East African port.",
//     architect: "Unknown",
//     ownership: "Tanzania Ports Authority",
//     style: "German Colonial Administrative",
//     inspected: "2023-11-08"
//   },
//   {
//     id: 6,
//     title: "Dar es Salaam City Hall",
//     era: "Independence",
//     condition: "Good",
//     grade: "Grade II Listed",
//     location: "City Centre",
//     year: 1956,
//     image: "../ASSETS/images/karimjeehall.png",
//     has360: true,
//     area: "740 m²",
//     description: "Late German colonial building overseeing the commercial harbour. Raised veranda, louvred shutters, and raised ground floor for coastal flooding.",
//     significance: "Documents the evolution of Dar es Salaam as a major East African port.",
//     architect: "Unknown",
//     ownership: "Tanzania Ports Authority",
//     style: "German Colonial Administrative",
//     inspected: "2023-11-08"
//   },
//   {
//     id: 7,
//     title: "Mnazi Mmoja Hospital Original Block",
//     era: "British",
//     condition: "Critical",
//     grade: "Proposed",
//     location: "Upanga",
//     year: 1918,
//     image: "",
//     has360: false,
//     atRisk: true,
//     area: "740 m²",
//     description: "Late German colonial building overseeing the commercial harbour. Raised veranda, louvred shutters, and raised ground floor for coastal flooding.",
//     significance: "Documents the evolution of Dar es Salaam as a major East African port.",
//     architect: "Unknown",
//     ownership: "Tanzania Ports Authority",
//     style: "German Colonial Administrative",
//     inspected: "2023-11-08"
//   },
//   {
//     id: 8,
//     title: "Dar es Salaam Railway Station",
//     era: "German",
//     condition: "Fair",
//     grade: "Grade I Listed",
//     location: "Kariakoo",
//     year: 1929,
//     image: "../ASSETS/images/tazara.png",
//     has360: true,
//     area: "740 m²",
//     description: "Late German colonial building overseeing the commercial harbour. Raised veranda, louvred shutters, and raised ground floor for coastal flooding.",
//     significance: "Documents the evolution of Dar es Salaam as a major East African port.",
//     architect: "Unknown",
//     ownership: "Tanzania Ports Authority",
//     style: "German Colonial Administrative",
//     inspected: "2023-11-08"
//   }
// ];

// // DOM references
// const buildingGrid = document.getElementById('buildingGrid');
// const searchInput = document.getElementById('searchInput');
// const resultsCount = document.getElementById('resultsCount');
// const modal = document.getElementById('detailModal');
// const closeModalBtn = document.getElementById('closeModalBtn');
// const formatClassString = (str) => str.replace(/\s+/g, '-').toLowerCase();

// function renderGrid(data) {
//   buildingGrid.innerHTML = '';
//   resultsCount.textContent = `${data.length} results`;

//   data.forEach(building => {
//     const card = document.createElement('div');
//     card.className = 'card';
//     card.dataset.id = building.id;

//     card.innerHTML = `
//       <div class="card-image-wrapper">
//         <img src="${building.image}" alt="${building.title}" class="card-image">
//         <span class="badge era-badge era-${formatClassString(building.era)}">${building.era}</span>
//         ${building.has360 ? '<span class="badge badge-360">360°</span>' : ''}
//         ${building.atRisk ? '<span class="badge at-risk-badge">⚠️ AT RISK</span>' : ''}
//       </div>
//       <div class="card-content">
//         <h3 class="card-title">${building.title}</h3>
//         <div class="badge-row">
//           <span class="status-tag cond-${formatClassString(building.condition)}">${building.condition}</span>
//           <span class="status-tag grade-${formatClassString(building.grade)}">${building.grade}</span>
//         </div>
//         <div class="card-footer">
//           <span class="location-tag">📍 ${building.location}</span>
//           <span class="year-tag">${building.year}</span>
//         </div>
//       </div>
//     `;
//     card.addEventListener('click', () => openModal(building.id));
//     buildingGrid.appendChild(card);
//   });
// }
// function openModal(id) {
//   const building = buildings.find(b => b.id === id);
//   if (!building) return;
//   resetModalTabs();

//   // Map database elements to modal nodes dynamically
//   document.getElementById('modalTitle').textContent = building.title;
//   document.getElementById('modalEra').textContent = building.era;
//   document.getElementById('modalCondition').textContent = building.condition;
//   document.getElementById('modalHero').style.backgroundImage = `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.7)), url('${building.image}')`;
  
//   document.getElementById('modalDistrict').textContent = building.location;
//   document.getElementById('modalBuilt').textContent = building.year;
//   document.getElementById('modalArea').textContent = building.area || "N/A";
//   document.getElementById('modalStatus').textContent = building.grade;

//   document.getElementById('modalDescription').textContent = building.description || "";
//   document.getElementById('modalSignificance').textContent = building.significance || "";
//   document.getElementById('modalArchitect').textContent = building.architect || "Unknown";
//   document.getElementById('modalOwnership').textContent = building.ownership || "Public Asset";
//   document.getElementById('modalStyle').textContent = building.style || "Vernacular Heritage";
//   document.getElementById('modalInspected').textContent = building.inspected || "Pending";
//   modal.classList.add('active');
// }

// closeModalBtn.addEventListener('click', () => modal.classList.remove('active'));
// window.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });


// const tabs = document.querySelectorAll('.tab-item');
// const panels = document.querySelectorAll('.modal-panel');

// tabs.forEach((tab, index) => {
//   tab.addEventListener('click', () => {

//     tabs.forEach(t => t.classList.remove('active'));
//     panels.forEach(p => p.classList.remove('active'));
//     tab.classList.add('active');
    
//     panels[index].classList.add('active');
//   });
// });

// function resetModalTabs() {
//   tabs.forEach(t => t.classList.remove('active'));
//   panels.forEach(p => p.classList.remove('active'));
  
//   if(tabs[0]) tabs[0].classList.add('active');
//   if(panels[0]) panels[0].classList.add('active');
// }
// // Live typing Search implementation
// searchInput.addEventListener('input', (e) => {
//   const text = e.target.value.toLowerCase();
//   const filtered = buildings.filter(b => 
//     b.title.toLowerCase().includes(text) || 
//     b.location.toLowerCase().includes(text)
//   );
//   renderGrid(filtered);
// });

// renderGrid(buildings);