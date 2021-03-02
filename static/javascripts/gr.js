const granimInstance = new Granim({
    element: '#canvas-interactive',
    name: 'interactive-gradient',
    elToSetClassOn: '.canvas-interactive-wrapper',
    direction: 'left-right',
    isPausedWhenNotInView: true,
    stateTransitionSpeed: 1000,
    states : {
        "default-state": {
            transitionSpeed: 2000,
            gradients: [
                // ['#ff9966', '#ff5e62'],
                // ['#00F260', '#0575E6'],
                // ['#e1eec3', '#f05053']
                ['#fff080', '#73b2ff'],
                ['#8cffab', '#0575E6'],
                ['#e1eec3', '#f05053']
            ]
        }
    }
});