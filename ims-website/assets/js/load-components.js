async function fetchComponents(filePath) {
  try {
    const res = await fetch(filePath);
    return await res.text();
  } catch (err) {
    console.error("Fetch error:", err);
    return "";
  }
}

function insertHtmlAndRunScriptsAt(placeholder, html) {
  const template = document.createElement('template');
  template.innerHTML = html;

  const parent = placeholder.parentNode;

  Array.from(template.content.childNodes).forEach(node => {
    if (node.nodeName.toLowerCase() === 'script') {

      const script = document.createElement('script');

      // Copy attributes
      for (let i = 0; i < node.attributes.length; i++) {
        const attr = node.attributes[i];
        script.setAttribute(attr.name, attr.value);
      }

      // Inline script
      if (node.textContent && node.textContent.trim()) {
        script.text = node.textContent;
      }

      parent.insertBefore(script, placeholder);

    } else {
      parent.insertBefore(node.cloneNode(true), placeholder);
    }
  });

  placeholder.remove();
}
