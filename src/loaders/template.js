var anchor = document.getElementById('content');

anchor.innerHTML = module.exports.view(module.exports.scenarios[window.scenario].context);
