import Head from "next/head";
import { properCasing } from "../utils/properCasing";
const meta = {
  title: "Crystal Cabins",
  keywords:
    "natural, handmade, malta, maltese, water safe, jewelry, high quality, handcrafted, crystal, crystal cabins, crystal store, crystals, local, small business, ethically made, local, small business, ethically made, teamseas, teamtrees",
  // no more than 160 characters in the meta tag
  description:
    "Crystal Cabins is a jewelry company based in Malta. We sell rings to people who want to donate money to good causes, and get something great in return. #teamseas #teamtrees",
};

export default function CategoryHead({ image, title }) {
  title = title ?? meta.title;
  return (
    <Head>
      <title>{properCasing(title)}</title>
      {/* Most important meta tags */}
      <meta
        httpEquiv='Content-Type'
        content='text/html; charset=utf-8'
      />
      <meta name='description' content={meta.description} />
      <meta
        name='viewport'
        content='width=device-width, initial-scale=1'
      />
      {/* Not necessary meta tags */}
      <meta name='keywords' content={meta.keywords} />
      <meta name='author' content='Aleksanteri Aho' />

      {/* <!-- Open Graph data --> */}
      <meta property='og:title' content={title} />
      <meta property='og:type' content='website' />
      <meta property='og:url' content='https://crystalcabins.com/' />
      <meta property='og:image' content={image} />
      <meta property='og:description' content={meta.description} />
      <meta property='og:site_name' content='Crystal Cabins' />
      {/* <meta property="fb:admins" content="Facebook numeric ID" /> */}

      <meta name='twitter:card' content='summary_large_image' />

      {/* TODO: check for errors on twitter and facebook card validators */}
    </Head>
  );
}
