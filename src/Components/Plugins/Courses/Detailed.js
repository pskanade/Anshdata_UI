import React, { Component } from "react";
import Link from "next/link";
import { getCourse } from "../../../Requests/Courses";
import ReactPlayer from "react-player";
import {
  ModuleCardMd,
  DetailedModuleCard
} from "../../Generic/Cards/ModuleCard";

import {
  getIfEnrolled,
  enrollEventHandler
} from "../../../Requests/Enrollment";
import css from "./detailed.scss";

const menuTypes = {
  DETAIL: "Detailed",
  ASSIGNMENT: "Assignments"
};

const viewTypes = {
  MODIFY: "mod",
  DETAIL: "detail"
};

class DetailedCourse extends Component {
  state = {
    course: null,
    activeModule: 1,
    isEnrolledIn: false
  };

  setSelectedModule = courseId => {
    this.setState({ activeModule: courseId });
  };

  closeSelectedModule = () => {
    this.setState({ activeModule: null });
  };

  ifEnrolledSaveHandler = data => {
    console.log("Check If enrolled - response data:", data);
    if (data !== undefined && data.length === 1 && data[0].id !== undefined) {
      this.setState({ isEnrolledIn: true });
    }
  };

  courseSaveHandler = course => {
    console.log("[Detailed.js] saving course");
    this.setState({ course });
    this.props.setCourse(course);
  };

  renderLoader = () => {
    return (
      <div className={css.loader}>
        <div className={"ui active inverted centered inline loader massive"} />
      </div>
    );
  };

  getLessonsCount = modules => {
    return modules.reduce((sum, mod) => {
      return sum + mod.lessons.length;
    }, 0);
  };

  renderExtraInfo = (
    lessons = 3,
    author = "John Doe",
    subject = "Computer Science",
    assignments = 4
  ) => {
    return (
      <>
        <div className={css.info + " " + css.author}>
          <span className={css.value}>{author}</span>
          <br />
          <span className={css.label}>Author</span>
        </div>
        <div className={css.info + " " + css.sub}>
          <span className={css.value}>{subject}</span>
          <br />
          <span className={css.label}>Subject</span>
        </div>
        <div className={css.info + " " + css.lsn}>
          <span className={css.value}>{lessons}</span>
          <br />
          <span className={css.label}>Lessons</span>
        </div>
        <div className={css.info + " " + css.asign}>
          <span className={css.value}>{assignments}</span>
          <br />
          <span className={css.label}>Assignments</span>
        </div>
      </>
    );
  };

  RenderRating = (rating = 5) => {
    const ratingArr = [...Array(rating).keys()];

    return (
      <>
        {ratingArr.map(i => (
          <img
            src="./../../../../static/assets/icon/star_24px_outlined.svg"
            key={i}
          />
        ))}
      </>
    );
  };

  renderStats = (creditPoints, enrollments = 203, rating = 5) => {
    return (
      <>
        <div className={css.stat}>
          <span className={css.value}>{creditPoints}</span>
          <br />
          <span className={css.label}>Credit Points</span>
        </div>
        <div className={css.stat}>
          <span className={css.value}>{enrollments}</span>
          <br />
          <span className={css.label}>Enrollments</span>
        </div>
        <div className={css.stat}>
          <span className={css.value}>{this.RenderRating(rating)}</span>
          <br />
          <span className={css.label}>Rating</span>
        </div>
      </>
    );
  };

  renderActionBtn = () => {
    // if the course is not already published then you may not enroll or attend to the course
    if (!this.state.course.is_published) {
      return null;
    } else if (this.state.isEnrolledIn) {
      return (
        <Link href={`/courses/attend/${this.state.course.id}`}>
          <button className={css.attend}>Attend</button>
        </Link>
      );
    } else {
      return (
        <Link href={`/courses/attend/${this.state.course.id}`}>
          <button
            className={css.enroll}
            onClick={() => enrollEventHandler(this.state.course.id)}>
            Enroll
          </button>
        </Link>
      );
    }
  };
  renderTags = course => {
    const tags = course.tagged_to;
    return tags.map(tag => {
      return (
        <span className={css.tag} key={tag.id}>
          {tag.title}
        </span>
      );
    });
  };

  renderCourseInfo = course => {
    let lecture = "https://www.youtube.com/embed/RKLKib4bHhA";
    try {
      const backup = "https://www.youtube.com/embed/RKLKib4bHhA";
      lecture = course.modules[0].lessons[0].lecture;
      lecture = lecture === "" || lecture === null ? backup : lecture;
      console.log("Found lecure : ", course.id, lecture);
    } catch (err) {
      console.log("Doest not have lectures : ", course.id);
    }
    return (
      <>
        <div className={css.primaryInfo}>
          <span className={css.courseTitle}>{course.title}</span>
          <div className={css.courseDetails}>
            <span className={css.courseDescription}>{course.description}</span>
            <div className={css.tagBox}>{this.renderTags(course)}</div>
            <div className={css.advance}>
              {this.renderActionBtn()}
              <div className={css.statsBox}>
                {this.renderStats(course.credit_points)}
              </div>
            </div>
          </div>
        </div>
        <div className={css.secondaryInfo}>
          <div className={css.introClip}>
            <ReactPlayer
              url={lecture}
              controls
              pip={true}
              height="100%"
              width="100%"
            />
          </div>
          <div className={css.extraInfo}>
            {this.renderExtraInfo(
              this.getLessonsCount(course.modules),
              course.author.username,
              course.category.title,
              course.assignments.length
            )}
          </div>
        </div>
      </>
    );
  };

  renderModulesList = modules => {
    return modules.map(mod => {
      return (
        <>
          <ModuleCardMd
            module={mod}
            key={mod.id}
            select={this.setSelectedModule}
          />
          {this.state.activeModule === mod.id ? (
            <DetailedModuleCard
              module={mod}
              key={`detailed_${mod.id}`}
              close={this.closeSelectedModule}
            />
          ) : null}
        </>
      );
    });
  };

  renderUnpublishedWarning = () => {
    if (this.state.course.is_published) {
      return null;
    }
    return (
      <div className={css.warningRibbon}>
        <h1>
          You are auditing an <span>unpublished</span> course!
        </h1>
      </div>
    );
  };

  render() {
    if (this.state.course === null || this.state.course === undefined) {
      return <div>{this.renderLoader()}</div>;
    }
    const { course } = this.state;
    return (
      <div className={css.container}>
        <div className={css.courseInfo}>{this.renderCourseInfo(course)}</div>
        {this.renderUnpublishedWarning()}
        <div className={css.courseContent}>
          <span className={css.sectionTitle}>Modules</span>
          <div className={css.moduleList}>
            {this.renderModulesList(course.modules)}
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    getCourse(this.props.courseId, this.courseSaveHandler);
    getIfEnrolled(this.props.courseId, this.ifEnrolledSaveHandler);
  }
}

export default DetailedCourse;

// TODO: Show course level assignments
