import HomePage from './index';
import { Notification } from '../../common/types';
import { ideas } from '../../fakes/fakeIdeas';
import { Idea } from '@/common/types';
interface HomePagePollProps {
    notifications: Notification[];
    ideas: Idea[];
    currentIdea: Idea | undefined;
    
}

export const homePagePoll = (currentProps: HomePagePollProps) : HomePagePollProps => {
    let notifications = [] as Notification[];
    let ideas = [] as Idea[];
    let props = {
        notifications: notifications,
        ideas: ideas,
        currentIdea: undefined
    }
    return props;

}