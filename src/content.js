document.addEventListener('mousemove', function(event) {
    const screenWidth = window.innerWidth;
    const cursorPositionX = event.clientX;

    const highlightedElements = document.querySelectorAll('.highlight, .highlightNext');
    highlightedElements.forEach((el) => {
        el.classList.remove('highlight');
        el.classList.remove('highlightNext');
    });

    if (cursorPositionX < screenWidth * 2 / 3) {
        return;
    }

    const allTextNodes = getTextNodesIn(document.body);
    let currentLineNode = null;

    allTextNodes.forEach((node) => {
        const rects = getNodeRects(node);
        rects.forEach((rect, index) => {
            if (
                event.clientX >= rect.left &&
                event.clientX <= rect.right &&
                event.clientY >= rect.top &&
                event.clientY <= rect.bottom
            ) {
                currentLineNode = { node, index };
            }
        });
    });

    if (currentLineNode) {
        highlightLine(currentLineNode.node, currentLineNode.index);
        const nextLineNode = getNextLineNode(currentLineNode, allTextNodes);
        if (nextLineNode) {
            highlightLine(nextLineNode.node, nextLineNode.index);
        }
    }
});

function getTextNodesIn(node) {
    let textNodes = [];
    if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== '') {
        textNodes.push(node);
    } else {
        node.childNodes.forEach((child) => {
            textNodes = textNodes.concat(getTextNodesIn(child));
        });
    }
    return textNodes;
}

function getNodeRects(node) {
    const range = document.createRange();
    range.selectNodeContents(node);
    return Array.from(range.getClientRects());
}

function highlightLine(node, index) {
    const range = document.createRange();
    const rects = getNodeRects(node);
    if (rects[index]) {
        const span = document.createElement('span');
        span.classList.add(index === 0 ? 'highlight' : 'highlightNext');
        range.setStart(node, 0);
        range.setEnd(node, node.length);
        range.surroundContents(span);
    }
}

function getNextLineNode(currentLineNode, allNodes) {
    const nextNodeIndex = allNodes.indexOf(currentLineNode.node) + 1;
    if (nextNodeIndex < allNodes.length) {
        const nextNode = allNodes[nextNodeIndex];
        return { node: nextNode, index: 0 }; 
    }
    return null;
}
