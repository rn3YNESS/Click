const loadScript = (scriptRef) => {

    const scriptPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        document.body.appendChild(script);
        script.onload = resolve;
        script.onerror = reject;
        script.async = true;
        script.src = scriptRef;
    });

    scriptPromise.then(() => {

    }).catch(error => {
        console.log(error);
    });
}

const removeScript = (scriptRef) => {
    Object.keys(object).forEach(
        key => console.log(object[key]) //delete object[key]
    );
    /*const script = document.querySelector(`script[src='${scriptRef}']`);
    script.parentNode.removeChild(script);*/
}