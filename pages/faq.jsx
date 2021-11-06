import Head from "next/head";

// @ts-ignore
import styles from "../styles/FAQ.module.scss";

function QuestionAnswerPair({ question, answer }) {
  return (
    <div className={styles.QandA}>
      <h3 className={styles.QTitle}>{question}</h3>
      <p className={styles.ADescription}>{answer}</p>
    </div>
  );
}

export default function Faq() {
  return (
    <>
      <Head>
        <title>Frequently Asked Questions</title>
      </Head>
      <div>
        <h1>FAQ&apos;s</h1>
        <div className={styles.container}>
          <QuestionAnswerPair
            question='How long does an order take?'
            answer='Usually an order takes ---- days. If there is an issue please contact us on any of our social media'
          />
        </div>
      </div>
    </>
  );
}
