import Head from "next/head";

// @ts-ignore
import styles from "../styles/FAQ.module.scss";
import getTranslation from "../utils/getTranslation";

function QuestionAnswerPair({ question, answer }) {
  return (
    <div className={styles.QandA}>
      <h3 className={styles.QTitle}>{question}</h3>
      <p className={styles.ADescription}>{answer}</p>
    </div>
  );
}

export default function Faq({ lang }) {
  const translator = getTranslation(lang);
  return (
    <>
      <Head>
        <title>{translator("faq")}</title>
      </Head>
      <div>
        <h1>FAQ&apos;s</h1>
        <div className={styles.container}>
          <QuestionAnswerPair
            question={translator("fq1")}
            answer={translator("fa1")}
          />
        </div>
      </div>
    </>
  );
}
