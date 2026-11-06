// মোবাইল/ট্যাবলেট মেনু: ☰ বাটনে খোলা-বন্ধ, লিংকে চাপলে বন্ধ
(function () {
  'use strict';
  var nav = document.querySelector('.nav');
  var toggle = nav && nav.querySelector('.nav__toggle');
  if (!toggle) { return; }

  function setOpen(isOpen) {
    nav.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'মেনু বন্ধ করুন' : 'মেনু খুলুন');
  }

  toggle.addEventListener('click', function () { setOpen(!nav.classList.contains('is-open')); });
  nav.querySelectorAll('.nav__links a').forEach(function (link) {
    link.addEventListener('click', function () { setOpen(false); });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { setOpen(false); } });
})();
