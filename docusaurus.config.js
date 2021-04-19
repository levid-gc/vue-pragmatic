/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Vue.js 小工笔记',
  tagline: '学而不思则罔，思而不学则殆。',
  url: 'https://levid-gc.github.io',
  baseUrl: '/vue-pragmatic/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'levid-gc', // Usually your GitHub org/user name.
  projectName: 'vue-pragmatic', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'Vue.js 小工笔记',
      logo: {
        alt: 'Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          type: 'doc',
          docId: 'intro',
          position: 'left',
          label: '介绍',
        },
        {
          to: '/blog',
          label: '文章',
          position: 'left'
        },
        {
          href: 'https://github.com/levid-gc/vue-pragmatic',
          label: 'GitHub',
          position: 'right',
        },
      ],
    }
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
