// Sample data (replace with real data)
const nodes = [
  [
    { name: 'Water Tank', status: 'working', lastUpdated: '2023-08-21 10:30 AM'},
    { name: 'Water Tank', status: 'not working', lastUpdated: '2023-08-21 11:45 AM'}
  ],
  [
    { name: 'Prawah', status: 'working', lastUpdated: '2023-08-21 10:30 AM'},
    { name: 'Prawah', status: 'working', lastUpdated: '2023-08-21 10:30 AM'}
  ],
  [
    { name: 'Shenitech Water Meter', status: 'not working', lastUpdated: '2023-08-21 11:45 AM'},
    { name: 'Shenitech Water Meter', status: 'not working', lastUpdated: '2023-08-21 09:15 AM'}
  ],
  [
    { name: 'Sump', status: 'working', lastUpdated: '2023-08-21 09:15 AM'},
    { name: 'Sump', status: 'working', lastUpdated: '2023-08-21 09:15 AM'}
  ],
  [
    { name: 'Borewell', status: 'working', lastUpdated: '2023-08-21 10:30 AM'},
    { name: 'Borewell', status: 'working', lastUpdated: '2023-08-21 10:30 AM'}
  ]
  // ... Add other grouped nodes here ...
];

// Flatten the grouped nodes array
const flattenedNodes = nodes.flat();

// DOM VARIABLES
const waterTankCheckbox = document.getElementById('nodeA');
const prawahCheckbox = document.getElementById('nodeB');
const workingNodesContainer = document.querySelector('.working-nodes');
const notWorkingNodesContainer = document.querySelector('.not-working-nodes');

// FUNCTION FOR CHECK-BOX SELECTION NODES
function updateNodesDisplay(selectedNodeName) {
  const selectedNodes = flattenedNodes.filter(node => node.name === selectedNodeName);
  workingNodesContainer.innerHTML = '';
  notWorkingNodesContainer.innerHTML = '';

  selectedNodes.forEach(node => {
    const nodeElement = createNodeElement(node);
      if (node.status === 'working') {
        nodeElement.classList.add('working-node'); // Add a class for working nodes
      } else {
        nodeElement.classList.add('not-working-node'); // Add a class for not working nodes
      }

      if (node.status === 'working') {
        workingNodesContainer.appendChild(nodeElement);
      } else {
        notWorkingNodesContainer.appendChild(nodeElement);
      }
  });
}
// FUNCTION FOR TO SHOW ALL NODE BY UNCLICKING CHECK-BOX
function showAllNodes() {
  workingNodesContainer.innerHTML = '';
  notWorkingNodesContainer.innerHTML = '';
  flattenedNodes.forEach(node => {
     const nodeElement = createNodeElement(node);
    if (node.status === 'working') {
      nodeElement.classList.add('working-node'); // Add a class for working nodes
    } else {
      nodeElement.classList.add('not-working-node'); // Add a class for not working nodes
    }

    if (node.status === 'working') {
      workingNodesContainer.appendChild(nodeElement);
    } else {
      notWorkingNodesContainer.appendChild(nodeElement);
    }
  });
}
//----- WATER TANK CHECK BOX --------------//
waterTankCheckbox.addEventListener('change', () => {
  if (waterTankCheckbox.checked) {
    updateNodesDisplay('Water Tank');
    console.log("tank working");
  } else {
    showAllNodes(); // Call the function to show all nodes
  }
});
//----- PRAVAH CHECK BOX --------------//
prawahCheckbox.addEventListener('change', () => {
  if (prawahCheckbox.checked) {
    updateNodesDisplay('Prawah');
  } else {
    showAllNodes();// Call the function to show all nodes
  }
});

//----- SHENITECH CHECK BOX --------------//
const shenitechCheckbox = document.getElementById('nodeC');
shenitechCheckbox.addEventListener('change', () => {
  if (shenitechCheckbox.checked) {
    // Show only the second position of the array
    const shenitechNodes = nodes[2]; // Passing the nodes by calling array index(positon)
    workingNodesContainer.innerHTML = '';
    notWorkingNodesContainer.innerHTML = '';

    shenitechNodes.forEach(node => {
      if (node.status === 'working') {
        workingNodesContainer.appendChild(createNodeElement(node));
      } else {
        notWorkingNodesContainer.appendChild(createNodeElement(node));
      }
    });
  } else {
    showAllNodes();// Call the function to show all nodes
  }
});
//----- SUMP CHECK BOX --------------//
const sumpCheckbox = document.getElementById('nodeD');
sumpCheckbox.addEventListener('change', () => {
  if (sumpCheckbox.checked) {
    // Show only the second position of the array
    const sumpNodes = nodes[3]; // Passing the nodes by calling array index(position) 
    workingNodesContainer.innerHTML = '';
    notWorkingNodesContainer.innerHTML = '';

    sumpNodes.forEach(node => {
      if (node.status === 'working') {
        workingNodesContainer.appendChild(createNodeElement(node));
      } else {
        notWorkingNodesContainer.appendChild(createNodeElement(node));
      }
    });
  } else {
    showAllNodes();// Call the function to show all nodes
  }
});
//-----BOREWELL CHECK BOX --------------//
const borewellCheckbox = document.getElementById('nodeE');
borewellCheckbox.addEventListener('change', () => {
  if (borewellCheckbox.checked) {
    // Show only the second position of the array
    const borewellNodes = nodes[4];
    workingNodesContainer.innerHTML = '';
    notWorkingNodesContainer.innerHTML = '';
    borewellNodes.forEach(node => {
      if (node.status === 'working') {
        workingNodesContainer.appendChild(createNodeElement(node));
      } else {
        notWorkingNodesContainer.appendChild(createNodeElement(node));
      }
    });
  } else {
    showAllNodes();// Call the function to show all nodes
  }
});

//--- FETCHING THE WORKING & NON-WORKING NODES FROM BACKEND
function createNodeElement(node) {
const nodeDiv = document.createElement('div');
  nodeDiv.classList.add('node');

  nodeDiv.innerHTML = `
      <h3  class="hdg">${node.name}</h3>
      Status: <span class="margin-top status-${node.status.replace(' ', '-')}">${node.status}</span><br>
     <span class="margin-top"> Last Updated: ${node.lastUpdated}</span>
  `;

  return nodeDiv;
}

flattenedNodes.forEach(node => {
  const nodeElement = createNodeElement(node);

  if (node.status === 'working') {
    workingNodesContainer.appendChild(nodeElement);
  } else {
    notWorkingNodesContainer.appendChild(nodeElement);
    nodeElement.classList.add("bg-color");
  }
});
//-- DOM VARIABLES----
const v1_2Element = document.querySelector('.v1_2');
const hideButton = document.getElementById('hideButton');
const showButton = document.getElementById('showButton');

//--- CLOSING BUTTON OF NODE STATUS---
hideButton.addEventListener('click', () => {
  showButton.style.display = 'block';
  hideButton.style.display = 'none';
  v1_2Element.classList.add('hidden-slide-animation');
  setTimeout(() => {
    v1_2Element.classList.add('hidden-slide');
  }, 1000); // 1000ms (1 second) matches the duration of the animation
});
//-- SHOWING BUTTON OF NODE STATUS----
showButton.addEventListener('click', () => {
  showButton.style.display = 'none';
  hideButton.style.display = 'block';
  v1_2Element.classList.remove('hidden-slide');
  v1_2Element.classList.remove('hidden-slide-animation');
  v1_2Element.classList.add('show-animation');
  setTimeout(() => {
    v1_2Element.classList.remove('show-animation');
  }, 1000); // 1000ms (1 second) matches the duration of the animation
});


///////////////////////////////////---------- CODE ENDS HERE-------///////////////////////////////////////////////////////
// DEVEOPER NAMES : ANSHAD A, AMAL MURALI PK
// SEP 01-09-2023 (CODE HAND OVER DATE)