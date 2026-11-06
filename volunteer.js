// স্বেচ্ছাসেবক ফর্ম: যাচাই করে প্রচার দলের হোয়াটসঅ্যাপে মেসেজ তৈরি করে।
// ওয়েবসাইটে কোনো তথ্য জমা হয় না; সমর্থক নিজে হোয়াটসঅ্যাপ থেকে পাঠান।
(function () {
  'use strict';

  // প্রচার দলের হোয়াটসঅ্যাপ নম্বর (দেশের কোডসহ, শুধু অঙ্ক)। যেমন: 8801XXXXXXXXX
  var CAMPAIGN_WHATSAPP = '';
  var BANGLA_DIGITS = '০১২৩৪৫৬৭৮৯';
  var BD_MOBILE = /^01[3-9]\d{8}$/;

  var form = document.getElementById('volunteer-form');
  if (!form) { return; }
  var errorEl = document.getElementById('v-error');
  var successEl = document.getElementById('v-success');

  function value(id) { return (document.getElementById(id).value || '').trim(); }

  function toAsciiDigits(str) {
    return str.replace(/[০-৯]/g, function (d) { return String(BANGLA_DIGITS.indexOf(d)); }).replace(/\D/g, '');
  }

  function normalisePhone(raw) {
    var digits = toAsciiDigits(raw);
    if (digits.indexOf('880') === 0) { digits = digits.slice(2); }
    return digits;
  }

  function markInvalid(id, isInvalid) {
    var field = document.getElementById(id).closest('.v-field');
    if (field) { field.classList.toggle('is-invalid', isInvalid); }
  }

  function showError(message) {
    errorEl.textContent = message;
    errorEl.hidden = !message;
    successEl.hidden = true;
  }

  function collect() {
    var roles = Array.prototype.slice.call(form.querySelectorAll('input[name="v-role"]:checked')).map(function (el) { return el.value; });
    return {
      name: value('v-name'),
      phone: normalisePhone(value('v-phone')),
      ward: value('v-ward'),
      village: value('v-village'),
      note: value('v-note'),
      roles: roles,
      consent: document.getElementById('v-consent').checked
    };
  }

  function validate(data) {
    markInvalid('v-name', !data.name);
    markInvalid('v-phone', !BD_MOBILE.test(data.phone));
    markInvalid('v-ward', !data.ward);
    if (!data.name) { return 'অনুগ্রহ করে আপনার নাম লিখুন।'; }
    if (!BD_MOBILE.test(data.phone)) { return 'সঠিক মোবাইল নম্বর দিন (০১ দিয়ে শুরু, ১১ অঙ্কের)।'; }
    if (!data.ward) { return 'অনুগ্রহ করে আপনার ওয়ার্ড বেছে নিন।'; }
    if (!data.roles.length) { return 'অন্তত একটি কাজ বেছে নিন।'; }
    if (!data.consent) { return 'যুক্ত হতে সম্মতির ঘরে টিক দিন।'; }
    return '';
  }

  function buildMessage(data) {
    var lines = [
      'আসসালামু আলাইকুম। আমি আব্দুল মান্নান মিয়াজীর স্বেচ্ছাসেবক দলে যুক্ত হতে চাই।',
      '',
      'নাম: ' + data.name,
      'মোবাইল: ' + data.phone,
      'ওয়ার্ড: ' + data.ward
    ];
    if (data.village) { lines.push('গ্রাম/পাড়া: ' + data.village); }
    lines.push('যে কাজে থাকতে চাই: ' + data.roles.join(', '));
    if (data.note) { lines.push('মন্তব্য: ' + data.note); }
    return lines.join('\n');
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var data = collect();
    var problem = validate(data);
    if (problem) { showError(problem); return; }
    if (!CAMPAIGN_WHATSAPP) {
      showError('প্রচার দলের হোয়াটসঅ্যাপ নম্বর এখনো যুক্ত হয়নি। শীঘ্রই চালু হবে।');
      return;
    }
    showError('');
    var url = 'https://wa.me/' + CAMPAIGN_WHATSAPP + '?text=' + encodeURIComponent(buildMessage(data));
    window.open(url, '_blank', 'noopener');
    successEl.hidden = false;
  });
})();
