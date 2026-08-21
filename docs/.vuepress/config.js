module.exports = {

    title: 'Ting Notebook',

    description: '3DGS SLAM Deep Learning Notes',

    base: '/Ting-notebook/',

    head: [
        [
            'link',
            {
                rel: 'stylesheet',
                // markdown-it-katex 2.0.3 renders with KaTeX 0.6.0.
                // Its generated markup must use the matching stylesheet.
                href: 'https://cdn.jsdelivr.net/npm/katex@0.6.0/dist/katex.min.css'
            }
        ]
    ],


    markdown: {
        extendMarkdown: md => {
            md.use(require('markdown-it-katex'))
        }
    },

    themeConfig: {

        sidebar: {

            '/3DGS/': [
                {
                    title: '3D Gaussian Splatting',
                    collapsable: false,

                    children: [
                        '',
                        'TEST0-Implicit-Neural-Representation',
                        '3D_Gaussian'
                    ]
                }
            ]

        }

    }

}
