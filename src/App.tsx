import {defineComponent, reactive} from "vue";
import {v1} from "uuid";

const rootId = v1();

interface Instance {
    id: string;
    parentId: string;
    value: string;
    children:string[];
}

export const App = defineComponent(() => {
    const id = v1()
    const instanceMap = reactive<Record<string, Instance>>({
        [id]: {
            id,
            parentId:rootId,
            value: '123',
            children:[]
        }
    })
    const roots = reactive<string[]>([id])
    return () => <div>
        {roots.map(id=>{
            return <div key={id} style={{
                display: 'flex'
            }}>
                <div contenteditable>
                    {instanceMap[id].value}
                </div>
                <div>{instanceMap[id].value}</div>
            </div>
        })}
    </div>
})
