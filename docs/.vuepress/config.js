module.exports = {

    title: 'Ting Notebook',

    description: '3DGS SLAM Deep Learning Notes',

    base: '/Ting-notebook/',

    themeConfig: {

        sidebar: {

            '/3DGS/': [
                {
                    title: '3D Gaussian Splatting',
                    collapsable: true,

                    children: [
                        '/3DGS/',
                        '/3DGS/TEST0-Implicit-Neural-Representation',
                        '/3DGS/3D_Gaussian_Splatting'
                    ]
                }
            ]

        }

    }

}