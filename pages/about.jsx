import Head from "next/head";
import useTranslation from "next-translate/useTranslation";

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

export default function Faq({ lang }) {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>{t("common:faq")}</title>
      </Head>
      <div>
        <h1>FAQ&apos;s</h1>
        <div className={styles.container}>
          <QuestionAnswerPair
            question={t("common:fq1")}
            answer={t("common:fa1")}
          />
        </div>
      </div>
    </>
  );
}
