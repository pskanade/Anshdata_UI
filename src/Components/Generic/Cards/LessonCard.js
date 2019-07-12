import React from "react";

import css from "./LessonCard.scss";

export const draftLessonCard = props => {
  return (
    <div className={css.lessonCard}>
      <div className={css.lesson}>
        <iframe
          src="https://www.youtube.com/embed/RKLKib4bHhA"
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        <span>{props.lesson.title}</span>
      </div>
      <div className={css.actionBox}>
        <div className={css.editBar}>
          <button
            className={css.edit}
            onClick={() =>
              props.modify("lesson", props.lesson.module, props.lesson.id)
            }>
            <img src="../../../../static/assets/icon/create_24px_outlined.svg" />
          </button>
          <button className={css.delete}>
            <img src="../../../../static/assets/icon/delete_sweep_24px_outlined.svg" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const LessonCard = props => {
  return (
    <div className={css.lessonCard}>
      <div className={css.lesson}>
        <iframe
          src="https://www.youtube.com/embed/RKLKib4bHhA"
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        <span>{props.lesson.title}</span>
      </div>
    </div>
  );
};
