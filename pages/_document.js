import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
    render() {
        const title = "RP Calculator | Calculate Your Total Rewards";
        const description =
            "Use the Reward Points Calculator to determine the total reward points you'll earn for your upcoming spend. Maximize your rewards and make the most of your purchases.";
        const image = "https://rpcalculator.vercel.app/_static/thumbnail.png";
        const slogan = "Unlock Your Rewards Potential with RP Calculator!";

        return (
            <Html lang="en">
                <Head>
                  <title>{title}</title>
                  <meta name="description" content={description} />
                  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                  <meta name="msapplication-TileColor" content="#ffffff" />
                  <meta name="theme-color" content="#ffffff" />

                  <meta charSet="utf-8" />
                  <meta name="viewport" content="width=device-width, initial-scale=1" />
                  <meta itemProp="image" content={image} />
                  {/* <meta property="og:logo" content="R"></meta> */}
                  <meta property="og:title" content={title} />
                  <meta property="og:description" content={description} />
                  <meta property="og:image" content={image} />

                  <meta name="twitter:card" content="summary_large_image" />
                  <meta name="twitter:creator" content="@devevignesh" />
                  <meta name="twitter:title" content={slogan} />
                  <meta name="twitter:description" content={description} />
                  <meta name="twitter:image" content={image} />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
